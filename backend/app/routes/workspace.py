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
            SELECT id, session_id, risk_score, status, detected_at
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
