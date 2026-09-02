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
import sqlite3

from fastapi import APIRouter, Depends, Query

from app.database import get_connection
from app.routes.auth import get_current_user

logger = logging.getLogger(__name__)

# Every route in this module inherits the authentication dependency, so a new
# endpoint cannot be added here and accidentally left public.
router = APIRouter(
    prefix="/api",
    tags=["SOC Workspace"],
    dependencies=[Depends(get_current_user)],
)

DEFAULT_LIMIT = 100
MAX_LIMIT = 500


def _rows(conn: sqlite3.Connection, sql: str, params: tuple) -> list[dict]:
    return [dict(row) for row in conn.execute(sql, params).fetchall()]


@router.get("/ti/iocs")
def get_iocs(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Latest indicators of compromise."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, value, type, severity, source, created_at
              FROM ti_iocs
          ORDER BY created_at DESC
             LIMIT ?
            """,
            (limit,),
        )


@router.get("/ti/actors")
def get_actors(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Tracked threat actor groups."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, name, aliases, origin, description
              FROM ti_actors
          ORDER BY name ASC
             LIMIT ?
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


@router.get("/ti/alerts")
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
        sql += " WHERE is_tailored = 1"
    sql += " ORDER BY detected_at DESC LIMIT ?"
    params += (limit,)

    with get_connection() as conn:
        return _rows(conn, sql, params)


@router.get("/ti/summary")
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
                (SELECT COUNT(*) FROM ti_alerts WHERE is_tailored = 1) AS tailored,
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
                COALESCE(SUM(status = 'blocked'), 0)                  AS blocked,
                COALESCE(SUM(risk_score >= 70), 0)                    AS high_risk
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


@router.get("/drp/phishing")
def get_phishing_domains(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Phishing domains detected against the customer's brand."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, domain, status, discovered_at
              FROM drp_phishing
          ORDER BY discovered_at DESC
             LIMIT ?
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
             LIMIT ?
            """,
            (limit,),
        )


@router.get("/incidents")
def get_incidents(limit: int = Query(DEFAULT_LIMIT, ge=1, le=MAX_LIMIT)):
    """Open and recently closed security incidents."""
    with get_connection() as conn:
        return _rows(
            conn,
            """
            SELECT id, title, severity, status, reported_by, created_at
              FROM incidents
          ORDER BY created_at DESC
             LIMIT ?
            """,
            (limit,),
        )
