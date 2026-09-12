"""Turn raw application events into alerts, at ingest time.

A stream of `record.view` / `login.failed` / `record.export` events is not, on
its own, something an analyst can watch — it is thousands of lines a minute.
Correlation is what makes it legible: a handful of rules that recognise the
shapes that matter (a brute-force run, an attempted export, one account
touching an unusual number of records) and raise a single alert for each.

Deliberately synchronous and in-process. It runs inside the ingest request,
against PostgreSQL, with no queue, worker or cron — so it works on exactly the
deployment already running and adds no moving parts. The cost is bounded: each
rule is one indexed count over a 15-minute window for one tenant.

Rules are plain and explained, not a black box. A hospital's security officer
can read what raised an alert and agree or disagree; a score nobody can
account for is worse than no score. The alerts land in `ti_alerts`, the same
table the Threat Intelligence console and the executive exposure score already
read, so a correlated alert shows up and raises the score with no extra wiring.

Every query and insert runs under the tenant the caller's connection already
announced, so a rule can only ever see and write one tenant's data.
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# How far back each rule looks. Short enough that a burst stands out, long
# enough that a slow run still crosses the threshold within one window.
_WINDOW = "15 minutes"

# Thresholds. Named so a reader sees the rule, not a magic number.
_FAILED_LOGIN_THRESHOLD = 5
_BULK_ACCESS_THRESHOLD = 10


def _already_alerted(conn: Any, title: str) -> bool:
    """Whether this exact alert was already raised inside the window.

    Correlation runs on every batch, so without this a sustained attack would
    raise the same alert on each ingest. One alert per window per shape is what
    an analyst wants — the count in it can grow, the row does not multiply.
    """
    return bool(
        conn.execute(
            "SELECT 1 FROM ti_alerts"
            " WHERE title = %s AND detected_at > now() - %s::interval"
            " LIMIT 1",
            (title, _WINDOW),
        ).fetchone()
    )


def _raise_alert(
    conn: Any, *, title: str, severity: str, actor: str | None, category: str
) -> bool:
    """Insert one correlation alert, unless an identical one is already open.

    tenant_id is left to its column default (`difaac_current_tenant()`), which
    resolves to the tenant the connection announced — the same tenant the
    events were ingested under. Returns whether a row was written.
    """
    if _already_alerted(conn, title):
        return False
    conn.execute(
        "INSERT INTO ti_alerts"
        " (title, category, severity, source, actor, is_tailored, detected_at)"
        " VALUES (%s, %s, %s, %s, %s, TRUE, now())",
        (title, category, severity, "Difaac correlation", actor),
    )
    logger.info("Correlation raised an alert: %s", title)
    return True


def correlate(conn: Any, events: list[Any]) -> int:
    """Evaluate the rules against what this tenant has reported recently.

    `conn` is already scoped to the tenant. Returns the number of new alerts
    raised. Never raises: a bug in a rule is a missed alert, not a failed
    ingest, so the caller wraps this defensively too.
    """
    raised = 0

    # Rule 1 — credential brute force. Many failed sign-ins in one window is
    # someone guessing, whoever they claim to be.
    failed = conn.execute(
        "SELECT COUNT(*) AS n FROM app_events"
        " WHERE action = 'login.failed' AND occurred_at > now() - %s::interval",
        (_WINDOW,),
    ).fetchone()["n"]
    if failed >= _FAILED_LOGIN_THRESHOLD:
        raised += _raise_alert(
            conn,
            title=f"Repeated failed sign-ins: {failed} in the last 15 minutes",
            severity="high",
            actor=None,
            category="brute-force",
        )

    # Rule 2 — attempted export that was refused. A denied or failed export is
    # someone reaching for data they could not take; it is worth a look even
    # though it did not succeed.
    for event in events:
        action = (getattr(event, "action", "") or "").lower()
        outcome = (getattr(event, "outcome", "") or "").lower()
        if "export" in action and outcome in ("denied", "failure"):
            actor = getattr(event, "actor", None)
            subject = getattr(event, "subject_ref", None)
            raised += _raise_alert(
                conn,
                title=f"Blocked data export by {actor or 'an unknown account'}"
                + (f" on {subject}" if subject else ""),
                severity="high",
                actor=actor,
                category="exfiltration",
            )

    # Rule 3 — bulk record access. One account viewing an unusual number of
    # records in a short window is the shape of a snooping or a compromised
    # account, the question a record-access trail exists to answer.
    for actor in {getattr(e, "actor", None) for e in events if getattr(e, "actor", None)}:
        views = conn.execute(
            "SELECT COUNT(*) AS n FROM app_events"
            " WHERE action = 'record.view' AND actor = %s"
            " AND occurred_at > now() - %s::interval",
            (actor, _WINDOW),
        ).fetchone()["n"]
        if views >= _BULK_ACCESS_THRESHOLD:
            raised += _raise_alert(
                conn,
                title=f"Unusual record access: {actor} opened {views} records in 15 minutes",
                severity="medium",
                actor=actor,
                category="bulk-access",
            )

    return raised
