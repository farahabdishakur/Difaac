"""Authenticated SOC workspace endpoints.

Threat intelligence, digital risk, fraud, and incident data. Unlike the
marketing content served elsewhere, everything here describes a customer's
security posture — indicators they are hunting, phishing aimed at their brand,
fraud cases, live incidents — and is readable only by an authenticated account.

Three rules apply to every handler below:

  * Authentication is required. There is no public view of this data.
  * Columns are listed explicitly, never ``SELECT *``. A column added to a
    table later must be exposed by a deliberate edit here, not automatically.
  * Result counts are bounded, so a single request cannot ask the database to
    materialise an unbounded number of rows.
"""

from __future__ import annotations

import logging
from typing import Any
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query, Request

from app.client_ip import client_ip
from app.database import get_connection
from app.permissions import Permission
from app.routes.auth import require_permission

logger = logging.getLogger(__name__)

# Every route in this module inherits `consoles:read`, so a new endpoint cannot
# be added here and accidentally left public. That is the floor, not the whole
# answer: routes that serve a named kind of data also ask for the permission
# that names it -- `intel:read` on the threat-intelligence routes,
# `alerts:read` on alerts, `incidents:read` on incidents, `reports:read` on the
# executive overview, and `audit:read` on the record-access trail.
#
# Every role holds all of those today, so nothing a current user reaches
# changes. What changes is that the permission model stops being decorative:
# a role created without `incidents:read` is now actually refused the
# incidents, rather than let in by the blanket check and contradicting the
# table in permissions.py.
router = APIRouter(
    prefix="/api",
    tags=["SOC Workspace"],
    dependencies=[Depends(require_permission(Permission.CONSOLES_READ))],
)

DEFAULT_LIMIT = 100
MAX_LIMIT = 500


def _rows(conn: Any, sql: str, params: tuple) -> list[dict]:
    return [dict(row) for row in conn.execute(sql, params).fetchall()]


@router.get(
    "/ti/iocs",
    dependencies=[Depends(require_permission(Permission.INTEL_READ))],
)
def get_iocs(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Latest indicators of compromise."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, value, type, severity, source, created_at
              FROM ti_iocs
          ORDER BY created_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get(
    "/ti/actors",
    dependencies=[Depends(require_permission(Permission.INTEL_READ))],
)
def get_actors(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Tracked threat actor groups."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, name, aliases, origin, description
              FROM ti_actors
          ORDER BY name ASC
             LIMIT %s
            """,
            (limit,),
        )


# Severity weights behind the dashboard's single exposure figure.
#
# The score is the severity-weighted *mean* of open alerts, normalised against
# an all-critical feed — not a running total. A sum would climb with volume
# alone and saturate at 100 on any busy day, which tells an analyst nothing;
# a mean answers the question actually being asked, "how serious is what is
# open right now", and stays comparable week to week.
#
# The endpoint returns the counts it was derived from alongside it, so the
# number can always be checked against the rows behind it.
_SEVERITY_WEIGHT = {"critical": 10, "high": 6, "medium": 3, "low": 1}
_MAX_SEVERITY_WEIGHT = max(_SEVERITY_WEIGHT.values())


@router.get(
    "/ti/alerts",
    dependencies=[Depends(require_permission(Permission.ALERTS_READ))],
)
def get_ti_alerts(
    limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT),
    tailored_only: bool = Query(False),
):
    """The threat alert feed, newest first.

    `tailored_only` narrows the feed to alerts raised against this
    organisation's own assets and brand, which is how an analyst reads it
    day to day.
    """
    sql = """
        SELECT id, title, category, severity, source, actor, is_tailored, detected_at
          FROM ti_alerts
    """
    params: tuple = ()
    if tailored_only:
        sql += " WHERE is_tailored"
    sql += " ORDER BY detected_at DESC LIMIT %s"
    params += (limit,)

    with get_connection() as conn:
        return _rows(conn, sql, params)


@router.get(
    "/ti/summary",
    dependencies=[Depends(require_permission(Permission.INTEL_READ))],
)
def get_ti_summary():
    """Counts and a derived exposure score for the intelligence dashboard.

    Everything here is computed from the tables on each request rather than
    stored, so the dashboard cannot drift out of step with the rows an
    analyst can open and read for themselves.
    """
    with get_connection() as conn:
        severity_counts = {
            row["severity"]: row["count"]
            for row in _rows(
                conn,
                "SELECT severity, COUNT(*) AS count FROM ti_alerts GROUP BY severity",
                (),
            )
        }
        category_counts = _rows(
            conn,
            """
            SELECT category, COUNT(*) AS count
              FROM ti_alerts
          GROUP BY category
          ORDER BY count DESC
            """,
            (),
        )
        totals = conn.execute(
            """
            SELECT
                (SELECT COUNT(*) FROM ti_alerts)                  AS alerts,
                (SELECT COUNT(*) FROM ti_alerts WHERE is_tailored) AS tailored,
                (SELECT COUNT(*) FROM ti_iocs)                    AS iocs,
                (SELECT COUNT(*) FROM ti_actors)                  AS actors
            """
        ).fetchone()

        weighted = sum(
            _SEVERITY_WEIGHT.get(severity, 0) * count
            for severity, count in severity_counts.items()
        )
        scored_alerts = sum(
            count
            for severity, count in severity_counts.items()
            if severity in _SEVERITY_WEIGHT
        )
        # An empty feed scores 0 rather than dividing by zero — nothing open is
        # genuinely no exposure, not an undefined figure.
        score = (
            round(100 * weighted / (_MAX_SEVERITY_WEIGHT * scored_alerts))
            if scored_alerts
            else 0
        )

        return {
            "exposure_score": score,
            "severity_counts": severity_counts,
            "category_counts": category_counts,
            "total_alerts": totals["alerts"],
            "tailored_alerts": totals["tailored"],
            "total_iocs": totals["iocs"],
            "total_actors": totals["actors"],
        }


@router.get("/fraud/summary")
def get_fraud_summary():
    """Aggregate view of scored sessions for the fraud dashboard.

    The breakdowns are GROUP BY queries over `fraud_cases`, so every figure
    on the dashboard traces back to rows in the table below it.
    """
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT
                COUNT(*)                                              AS total,
                COALESCE(AVG(risk_score), 0)                          AS average_risk,
                COALESCE(SUM((status = 'blocked')::int), 0)                  AS blocked,
                COALESCE(SUM((risk_score >= 70)::int), 0)                    AS high_risk
              FROM fraud_cases
            """
        ).fetchone()

        return {
            "total_cases": totals["total"],
            "blocked": totals["blocked"],
            "high_risk": totals["high_risk"],
            "average_risk": round(totals["average_risk"], 1),
            "by_signal": _rows(
                conn,
                """
                SELECT COALESCE(signal, 'Unclassified') AS signal,
                       COUNT(*)                         AS count
                  FROM fraud_cases
              GROUP BY signal
              ORDER BY count DESC
                """,
                (),
            ),
            "by_channel": _rows(
                conn,
                """
                SELECT COALESCE(channel, 'unknown') AS channel,
                       COUNT(*)                     AS count
                  FROM fraud_cases
              GROUP BY channel
              ORDER BY count DESC
                """,
                (),
            ),
            "by_status": _rows(
                conn,
                """
                SELECT status, COUNT(*) AS count
                  FROM fraud_cases
              GROUP BY status
              ORDER BY count DESC
                """,
                (),
            ),
        }


@router.get("/asm/assets")
def get_asm_assets(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """External assets, most exposed first.

    Ordered by exposure rather than discovery date because this list is worked
    top-down: the question is what to fix next, not what turned up last.
    """
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, host, asset_type, service, port, issue,
                   exposure_score, is_shadow_it, status, discovered_at
              FROM asm_assets
          ORDER BY exposure_score DESC, discovered_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get("/asm/summary")
def get_asm_summary():
    """Counts and exposure breakdown for the attack surface dashboard."""
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT COUNT(*)                                   AS total,
                   COALESCE(SUM(is_shadow_it::int), 0)             AS shadow_it,
                   COALESCE(SUM((exposure_score >= 70)::int), 0)     AS critical,
                   COALESCE(SUM((issue IS NOT NULL)::int), 0)        AS with_issues,
                   COALESCE(AVG(exposure_score), 0)           AS average_exposure
              FROM asm_assets
             WHERE status = 'active'
            """
        ).fetchone()

        return {
            "total_assets": totals["total"],
            "shadow_it": totals["shadow_it"],
            "critical_exposures": totals["critical"],
            "assets_with_issues": totals["with_issues"],
            "average_exposure": round(totals["average_exposure"], 1),
            "by_type": _rows(
                conn,
                """
                SELECT asset_type, COUNT(*) AS count
                  FROM asm_assets
                 WHERE status = 'active'
              GROUP BY asset_type
              ORDER BY count DESC
                """,
                (),
            ),
        }


@router.get("/bep/messages")
def get_bep_messages(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Messages the email gateway acted on, newest first."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, subject, sender, recipient, threat_type,
                   verdict, has_payload, confidence, detected_at
              FROM bep_messages
          ORDER BY detected_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get("/bep/summary")
def get_bep_summary():
    """Aggregates for the email protection dashboard.

    `payload_free` is called out separately because it is the half of the
    problem detonation cannot catch, and therefore the half worth watching.
    """
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT COUNT(*)                                                AS total,
                   COALESCE(SUM((verdict IN ('blocked', 'detonated'))::int), 0)   AS stopped,
                   COALESCE(SUM((verdict = 'quarantined')::int), 0)               AS quarantined,
                   COALESCE(SUM((NOT has_payload)::int), 0)                       AS payload_free,
                   COALESCE(SUM((threat_type = 'bec')::int), 0)                   AS bec
              FROM bep_messages
            """
        ).fetchone()

        return {
            "total_messages": totals["total"],
            "stopped": totals["stopped"],
            "quarantined": totals["quarantined"],
            "payload_free": totals["payload_free"],
            "bec": totals["bec"],
            "by_threat_type": _rows(
                conn,
                """
                SELECT threat_type, COUNT(*) AS count
                  FROM bep_messages
              GROUP BY threat_type
              ORDER BY count DESC
                """,
                (),
            ),
            "by_verdict": _rows(
                conn,
                """
                SELECT verdict, COUNT(*) AS count
                  FROM bep_messages
              GROUP BY verdict
              ORDER BY count DESC
                """,
                (),
            ),
        }


@router.get("/xdr/detections")
def get_xdr_detections(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Detections across every monitored layer, newest first."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, rule, layer, severity, status, host, technique, detected_at
              FROM xdr_detections
          ORDER BY detected_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get("/xdr/summary")
def get_xdr_summary():
    """Aggregates for the managed detection dashboard."""
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT COUNT(*)                                        AS total,
                   COALESCE(SUM((status = 'open')::int), 0)               AS open,
                   COALESCE(SUM((status = 'contained')::int), 0)          AS contained,
                   COALESCE(SUM((severity IN ('critical','high'))::int), 0) AS high_severity
              FROM xdr_detections
            """
        ).fetchone()

        return {
            "total_detections": totals["total"],
            "open": totals["open"],
            "contained": totals["contained"],
            "high_severity": totals["high_severity"],
            "by_layer": _rows(
                conn,
                """
                SELECT layer, COUNT(*) AS count
                  FROM xdr_detections
              GROUP BY layer
              ORDER BY count DESC
                """,
                (),
            ),
            "by_severity": _rows(
                conn,
                """
                SELECT severity, COUNT(*) AS count
                  FROM xdr_detections
              GROUP BY severity
              ORDER BY count DESC
                """,
                (),
            ),
        }


@router.get("/drp/summary")
def get_drp_summary():
    """Aggregates for the digital risk dashboard.

    The median time to takedown is computed in SQL over completed takedowns
    only — averaging in the items still open would report a number that gets
    better every time a case stalls.
    """
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT COUNT(*)                                        AS total,
                   COALESCE(SUM((takedown_at IS NOT NULL)::int), 0)       AS taken_down,
                   COALESCE(SUM((status = 'active')::int), 0)             AS active,
                   COALESCE(SUM((risk IN ('critical','high'))::int), 0)   AS high_risk
              FROM drp_phishing
            """
        ).fetchone()

        hours = [
            row["hours"]
            for row in _rows(
                conn,
                """
                SELECT EXTRACT(EPOCH FROM (takedown_at::timestamp - discovered_at::timestamp)) / 3600.0 AS hours
                  FROM drp_phishing
                 WHERE takedown_at IS NOT NULL
              ORDER BY hours
                """,
                (),
            )
        ]
        median = round(hours[len(hours) // 2], 1) if hours else None

        return {
            "total_items": totals["total"],
            "taken_down": totals["taken_down"],
            "active": totals["active"],
            "high_risk": totals["high_risk"],
            "median_takedown_hours": median,
            "by_channel": _rows(
                conn,
                """
                SELECT COALESCE(channel, 'unknown') AS channel, COUNT(*) AS count
                  FROM drp_phishing
              GROUP BY channel
              ORDER BY count DESC
                """,
                (),
            ),
        }


@router.get("/drp/phishing")
def get_phishing_domains(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Phishing domains detected against the customer's brand."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, domain, status, channel, risk, takedown_at, discovered_at
              FROM drp_phishing
          ORDER BY discovered_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get("/fraud/cases")
def get_fraud_cases(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Recent fraud cases and flagged sessions."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, session_id, risk_score, status, signal, channel, country, detected_at
              FROM fraud_cases
          ORDER BY detected_at DESC
             LIMIT %s
            """,
            (limit,),
        )


@router.get(
    "/incidents",
    dependencies=[Depends(require_permission(Permission.INCIDENTS_READ))],
)
def get_incidents(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Open and recently closed security incidents."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, title, severity, status, reported_by, created_at
              FROM incidents
          ORDER BY created_at DESC
             LIMIT %s
            """,
            (limit,),
        )


# Organisation-wide view
# What a manager or administrator opens the platform to see: not six consoles
# to visit in turn, but one answer to "how bad is it right now, and what needs
# a decision today".

@router.get(
    "/overview/executive",
    dependencies=[Depends(require_permission(Permission.REPORTS_READ))],
)
def get_executive_overview():
    """A single cross-product picture of where the organisation stands.

    Every figure here is a live count over the same tables the consoles read,
    so this page and the console a reader clicks into can never disagree. The
    posture score is a weighted blend of the individual product signals rather
    than a seventh number stored somewhere — a stored score is one that goes
    stale the moment anything else changes.
    """
    with get_connection() as conn:
        counts = conn.execute(
            """
            SELECT
                (SELECT COUNT(*) FROM ti_alerts WHERE severity = 'critical')          AS critical_intel,
                (SELECT COUNT(*) FROM xdr_detections WHERE severity = 'critical')     AS critical_detections,
                (SELECT COUNT(*) FROM incidents WHERE status != 'RESOLVED')           AS open_incidents,
                (SELECT COUNT(*) FROM xdr_detections WHERE status = 'open')           AS open_detections,
                (SELECT COUNT(*) FROM asm_assets WHERE exposure_score >= 70
                                                   AND status = 'active')             AS exposed_assets,
                (SELECT COUNT(*) FROM asm_assets WHERE status = 'active')             AS total_assets,
                (SELECT COUNT(*) FROM drp_phishing WHERE takedown_at IS NULL)         AS live_brand_abuse,
                (SELECT COUNT(*) FROM fraud_cases WHERE risk_score >= 70)             AS high_risk_sessions,
                (SELECT COUNT(*) FROM bep_messages WHERE threat_type = 'bec')         AS bec_attempts,
                (SELECT COUNT(*) FROM ti_actors)                                      AS tracked_actors
            """
        ).fetchone()

        # The events a decision-maker would want to see first, drawn from the
        # three tables that carry severity, merged and ranked by recency. A
        # UNION rather than three requests so the ordering is done once, by
        # the database, over the whole set.
        critical_events = _rows(
            conn,
            """
            SELECT title, 'Threat intelligence' AS source, severity, detected_at AS occurred_at
              FROM ti_alerts   WHERE severity IN ('critical', 'high')
             UNION ALL
            SELECT rule AS title, 'Managed XDR' AS source, severity, detected_at AS occurred_at
              FROM xdr_detections WHERE severity IN ('critical', 'high')
             UNION ALL
            SELECT title, 'Incident' AS source, severity, created_at AS occurred_at
              FROM incidents   WHERE severity IN ('CRITICAL', 'HIGH')
          ORDER BY occurred_at DESC
             LIMIT 8
            """,
            (),
        )

    critical_total = counts["critical_intel"] + counts["critical_detections"]

    # Posture is expressed as risk, so 0 is a clean estate and 100 is one on
    # fire. Each term is capped before weighting, so a single noisy signal
    # cannot drive the whole figure — an estate with 400 exposed assets is in
    # trouble, but not four times the trouble of one with 100.
    def capped(value: int, ceiling: int) -> float:
        return min(value, ceiling) / ceiling

    posture = round(
        100
        * (
            0.35 * capped(critical_total, 12)
            + 0.25 * capped(counts["open_incidents"], 8)
            + 0.20 * capped(counts["exposed_assets"], 10)
            + 0.10 * capped(counts["live_brand_abuse"], 8)
            + 0.10 * capped(counts["high_risk_sessions"], 12)
        )
    )

    return {
        "posture_score": posture,
        "critical_threats": critical_total,
        "open_incidents": counts["open_incidents"],
        "unresolved_detections": counts["open_detections"],
        "exposed_assets": counts["exposed_assets"],
        "total_assets": counts["total_assets"],
        "live_brand_abuse": counts["live_brand_abuse"],
        "high_risk_sessions": counts["high_risk_sessions"],
        "bec_attempts": counts["bec_attempts"],
        "tracked_actors": counts["tracked_actors"],
        "critical_events": critical_events,
    }


@router.get(
    "/overview/trend",
    dependencies=[Depends(require_permission(Permission.REPORTS_READ))],
)
def get_activity_trend(days: int = Query(14, ge=7, le=90)):
    """Security events per day, across intelligence, detection, and incidents.

    One series rather than three: the question this answers is "is activity
    rising", and splitting it by source turns a glance into a comparison the
    reader did not ask for. The consoles already break the same events down by
    source for anyone who wants that.

    Days with no events are returned as zeros rather than omitted — a gap in a
    time series reads as missing data, not as a quiet day.
    """
    with get_connection() as conn:
        rows = _rows(
            conn,
            """
            WITH events(occurred_at) AS (
                SELECT detected_at FROM ti_alerts
                 UNION ALL
                SELECT detected_at FROM xdr_detections
                 UNION ALL
                SELECT created_at  FROM incidents
            )
            SELECT occurred_at::date AS day, COUNT(*) AS count
              FROM events
             WHERE occurred_at >= current_date - make_interval(days => %s)
          GROUP BY day
            """,
            (days - 1,),
        )

    # The rows come back with a real date in `day`, so the series is built from
    # dates and formatted once at the end. Keying the lookup by the formatted
    # string instead would miss every row and return a chart of zeros — which
    # looks like a quiet fortnight rather than a bug.
    counted = {row["day"]: row["count"] for row in rows}
    # The database session runs in UTC, so the series has to be counted in UTC
    # too. `date.today()` is the machine's local day, and on a server three
    # hours ahead of UTC that is a different day for three hours out of every
    # twenty-four.
    today = datetime.now(timezone.utc).date()
    series = []
    for offset in range(days - 1, -1, -1):
        day = today - timedelta(days=offset)
        series.append({"day": day.isoformat(), "count": counted.get(day, 0)})
    return {"days": days, "series": series, "total": sum(p["count"] for p in series)}


@router.get(
    "/app-events",
    # This one endpoint asks for more than the console-wide `consoles:read`
    # every route in this module inherits. `consoles:read` is in the base set,
    # which means every role holds it — including `viewer`. That is the right
    # gate for detections and phishing domains, and the wrong one here.
    dependencies=[Depends(require_permission(Permission.AUDIT_READ))],
)
def list_app_events(
    request: Request,
    limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT),
    action: str | None = Query(None, max_length=120),
    outcome: str | None = Query(None, max_length=40),
    current_user: dict = Depends(require_permission(Permission.AUDIT_READ)),
):
    """What the customer's own systems have reported.

    For a hospital this is the record-access trail: `action` says what was
    done, `subject_ref` says to which record, and `actor` says by whom. It is
    the answer to "who opened this patient's file", which is a question a
    regulator asks and an ordinary SOC console cannot answer.

    It is also the most sensitive stream Difaac holds for that customer, and
    it is the one place where the answer to "who may see this" is narrower
    than the rest of the console: `audit:read`, held by administrators and
    security managers, not by every signed-in analyst and viewer.

    Reading it is itself recorded. An audit trail nobody audits the reading of
    is half a control — for a healthcare customer the question "who looked at
    the record-access log" has the same weight as the log itself.
    """
    clauses: list[str] = []
    params: list[object] = []
    if action:
        clauses.append("action = %s")
        params.append(action)
    if outcome:
        clauses.append("outcome = %s")
        params.append(outcome)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    params.append(limit)

    with get_connection() as conn:
        rows = conn.execute(
            f"""
            SELECT id, source, action, outcome, severity, actor, subject_ref,
                   ip_address, detail, occurred_at, received_at
              FROM app_events
              {where}
          ORDER BY occurred_at DESC
             LIMIT %s
            """,
            tuple(params),
        ).fetchall()

    logger.info(
        "Record-access trail read by %s (tenant %s): %d events, action=%r outcome=%r, from %s",
        current_user["email"],
        current_user["tenant_id"],
        len(rows),
        action,
        outcome,
        client_ip(request),
    )
    return rows
