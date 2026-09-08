"""The integration path: an application authenticating with a key and posting
what it saw.

The test that matters most here is `test_events_land_in_the_key_s_tenant`. The
key decides which customer's console an event appears in, and nothing in the
payload can change that — a caller able to name its own tenant could write into
somebody else's audit trail, and the row-level policy would allow it, because
the policy checks that a row matches the announced tenant rather than that the
announcement was honest.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import psycopg
import pytest
from psycopg.rows import dict_row

from app import api_keys
from app.config import DATABASE_URL
from app.tenancy import TENANT_SETTING

NOW = datetime.now(timezone.utc)


def _event(**overrides) -> dict:
    event = {
        "source": "ehr",
        "action": "record.read",
        "outcome": "success",
        "severity": "info",
        "actor": "nurse.test",
        "subject_ref": "patient:1",
        "occurred_at": NOW.isoformat(),
    }
    event.update(overrides)
    return event


@pytest.fixture
def integration():
    """A second tenant with an issued key, and the default tenant beside it."""
    with psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True) as conn:
        conn.execute(
            "INSERT INTO tenants (slug, name) VALUES ('ingest-test', 'Ingest Test')"
            " ON CONFLICT (slug) DO NOTHING"
        )
        tenant_id = conn.execute(
            "SELECT id FROM tenants WHERE slug = 'ingest-test'"
        ).fetchone()["id"]

        full, prefix, key_hash = api_keys.generate()
        conn.execute(
            "INSERT INTO api_keys (tenant_id, name, prefix, key_hash)"
            " VALUES (%s, 'test-key', %s, %s)",
            (tenant_id, prefix, key_hash),
        )
        revoked, revoked_prefix, revoked_hash = api_keys.generate()
        conn.execute(
            "INSERT INTO api_keys (tenant_id, name, prefix, key_hash, revoked_at)"
            " VALUES (%s, 'revoked-key', %s, %s, now())",
            (tenant_id, revoked_prefix, revoked_hash),
        )

    yield {"key": full, "revoked": revoked, "tenant_id": tenant_id, "prefix": prefix}

    with psycopg.connect(DATABASE_URL, autocommit=True) as conn:
        conn.execute("SELECT set_config(%s, %s, false)", (TENANT_SETTING, str(tenant_id)))
        conn.execute("DELETE FROM app_events")
        conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))
        conn.execute("DELETE FROM api_keys WHERE tenant_id = %s", (tenant_id,))
        conn.execute("DELETE FROM tenants WHERE id = %s", (tenant_id,))


class TestAuthentication:
    def test_no_key_is_refused(self, client):
        response = client.post("/api/ingest/events", json={"events": [_event()]})
        assert response.status_code == 401

    def test_unknown_key_is_refused(self, client):
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event()]},
            headers={"X-API-Key": "dfc_deadbeefcafe_not-a-real-secret"},
        )
        assert response.status_code == 401

    def test_malformed_key_is_refused(self, client):
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event()]},
            headers={"X-API-Key": "just-a-string"},
        )
        assert response.status_code == 401

    def test_revoked_key_is_refused(self, client, integration):
        """Revocation has to bite immediately, or it is a note rather than a control."""
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event()]},
            headers={"X-API-Key": integration["revoked"]},
        )
        assert response.status_code == 401

    def test_a_valid_key_is_accepted(self, client, integration):
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event()]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 202
        assert response.json()["accepted"] == 1


class TestIsolation:
    def test_events_land_in_the_key_s_tenant(self, client, integration):
        client.post(
            "/api/ingest/events",
            json={"events": [_event(subject_ref="patient:isolation")]},
            headers={"X-API-Key": integration["key"]},
        )

        with psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True) as conn:
            conn.execute(
                "SELECT set_config(%s, %s, false)",
                (TENANT_SETTING, str(integration["tenant_id"])),
            )
            mine = conn.execute(
                "SELECT subject_ref FROM app_events"
            ).fetchall()
            conn.execute("SELECT set_config(%s, '1', false)", (TENANT_SETTING,))
            theirs = conn.execute("SELECT subject_ref FROM app_events").fetchall()
            conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))

        assert {r["subject_ref"] for r in mine} == {"patient:isolation"}
        assert theirs == [], "an ingested event was visible to another tenant"

    def test_the_payload_cannot_choose_a_tenant(self, client, integration):
        """A tenant_id in the body is ignored: the key decides, not the caller."""
        payload = _event(subject_ref="patient:smuggle")
        payload["tenant_id"] = 1

        response = client.post(
            "/api/ingest/events",
            json={"events": [payload]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 202

        with psycopg.connect(DATABASE_URL, row_factory=dict_row, autocommit=True) as conn:
            conn.execute("SELECT set_config(%s, '1', false)", (TENANT_SETTING,))
            landed = conn.execute(
                "SELECT 1 FROM app_events WHERE subject_ref = 'patient:smuggle'"
            ).fetchall()
            conn.execute("SELECT set_config(%s, '', false)", (TENANT_SETTING,))

        assert landed == [], "a payload field redirected an event into another tenant"


class TestValidation:
    def test_an_unknown_outcome_is_rejected(self, client, integration):
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event(outcome="banana")]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 422

    def test_an_unknown_severity_is_rejected(self, client, integration):
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event(severity="catastrophic")]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 422

    def test_an_empty_batch_is_rejected(self, client, integration):
        response = client.post(
            "/api/ingest/events",
            json={"events": []},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 422

    def test_an_oversized_batch_is_rejected(self, client, integration):
        """The cap is what stops one request becoming the outage."""
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event() for _ in range(501)]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 422

    def test_a_skewed_clock_is_accepted_and_counted(self, client, integration):
        """Recorded, not refused: refusing would lose the evidence entirely."""
        stale = (NOW - timedelta(days=30)).isoformat()
        response = client.post(
            "/api/ingest/events",
            json={"events": [_event(occurred_at=stale)]},
            headers={"X-API-Key": integration["key"]},
        )
        assert response.status_code == 202
        assert response.json()["clock_skew_warnings"] == 1


class TestTheKeysThemselves:
    def test_the_secret_is_not_stored(self, integration):
        """A leaked database must not yield a working key."""
        with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
            row = conn.execute(
                "SELECT key_hash FROM api_keys WHERE prefix = %s", (integration["prefix"],)
            ).fetchone()

        assert integration["key"] not in row["key_hash"]
        assert row["key_hash"] != integration["key"].split("_", 2)[2]
        assert len(row["key_hash"]) == 64

    def test_two_keys_never_collide(self):
        prefixes = {api_keys.generate()[1] for _ in range(200)}
        assert len(prefixes) == 200
