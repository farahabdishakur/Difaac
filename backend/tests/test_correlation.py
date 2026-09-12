"""Correlation turns raw events into alerts — the rules, and the dedup.

These assert the shapes the rules are supposed to catch (a brute-force run, a
blocked export, bulk record access) do raise an alert, and — just as important
— that running correlation again over the same window does not raise the same
alert twice. A SOC that gets one row per attack is useful; one that gets a new
row on every ingest is noise.
"""

from __future__ import annotations

import os
from types import SimpleNamespace

os.environ.setdefault("DIFAAC_DEBUG", "true")

from app.correlation import correlate  # noqa: E402
from app.database import get_connection  # noqa: E402
from app.tenancy import DEFAULT_TENANT_SLUG, tenant_scope  # noqa: E402


def _default_tenant_id() -> int:
    with get_connection() as conn:
        return conn.execute(
            "SELECT id FROM tenants WHERE slug = %s", (DEFAULT_TENANT_SLUG,)
        ).fetchone()["id"]


def _clear(conn):
    conn.execute("DELETE FROM ti_alerts WHERE source = 'Difaac correlation'")
    conn.execute("DELETE FROM app_events")
    conn.commit()


def _ev(action, outcome, actor=None, subject_ref=None):
    return SimpleNamespace(action=action, outcome=outcome, actor=actor, subject_ref=subject_ref)


def test_brute_force_raises_one_alert(client):
    with tenant_scope(_default_tenant_id()), get_connection() as conn:
        _clear(conn)
        for _ in range(6):
            conn.execute(
                "INSERT INTO app_events (source, action, outcome, severity, actor, occurred_at)"
                " VALUES ('t','login.failed','failure','medium','unknown', now())"
            )
        conn.commit()
        assert correlate(conn, [_ev("login.failed", "failure", "unknown")]) >= 1
        conn.commit()
        n = conn.execute(
            "SELECT COUNT(*) AS n FROM ti_alerts WHERE category = 'brute-force'"
        ).fetchone()["n"]
        assert n == 1
        # Second pass in the same window must not duplicate it.
        correlate(conn, [_ev("login.failed", "failure", "unknown")])
        conn.commit()
        again = conn.execute(
            "SELECT COUNT(*) AS n FROM ti_alerts WHERE category = 'brute-force'"
        ).fetchone()["n"]
        assert again == 1


def test_blocked_export_raises_an_alert(client):
    with tenant_scope(_default_tenant_id()), get_connection() as conn:
        _clear(conn)
        raised = correlate(conn, [_ev("record.export", "denied", "nurse.x", "PATIENT-1")])
        conn.commit()
        assert raised == 1
        row = conn.execute(
            "SELECT category FROM ti_alerts WHERE source='Difaac correlation'"
        ).fetchone()
        assert row["category"] == "exfiltration"


def test_bulk_access_raises_an_alert(client):
    with tenant_scope(_default_tenant_id()), get_connection() as conn:
        _clear(conn)
        for i in range(10):
            conn.execute(
                "INSERT INTO app_events (source, action, outcome, severity, actor, subject_ref, occurred_at)"
                " VALUES ('t','record.view','success','info','dr.snoop', %s, now())",
                (f"PATIENT-{i}",),
            )
        conn.commit()
        raised = correlate(conn, [_ev("record.view", "success", "dr.snoop", "PATIENT-0")])
        conn.commit()
        assert raised == 1
        assert conn.execute(
            "SELECT COUNT(*) AS n FROM ti_alerts WHERE category='bulk-access'"
        ).fetchone()["n"] == 1


def test_quiet_traffic_raises_nothing(client):
    with tenant_scope(_default_tenant_id()), get_connection() as conn:
        _clear(conn)
        raised = correlate(conn, [_ev("record.view", "success", "dr.calm", "PATIENT-1")])
        conn.commit()
        assert raised == 0
