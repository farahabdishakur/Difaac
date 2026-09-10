"""Request inspection endpoint and middleware.

Two ways into the same engine:

  * ``POST /api/inspect`` — a protected application asks Difaac to score a
    request it has received. This is how a customer integrates without
    routing their traffic through us: their middleware calls this, gets a
    verdict, and enforces it themselves.

  * The ASGI middleware — Difaac's own API inspects every request reaching
    it. Difaac is the first protected application, so the detections in the
    Managed XDR console are real traffic against a real site rather than
    seeded rows.

Every detection at or above the flag threshold is written to
``xdr_detections``, which is the table the Managed XDR console already reads.
Nothing new had to be built on the frontend for these to appear.
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

from app.client_ip import client_ip
from app.database import get_connection
from app.inspection import FLAG_AT, Verdict, inspect
from app.permissions import Permission
from app.routes.auth import require_permission
from app.tenancy import DEFAULT_TENANT_SLUG, current_tenant, tenant_scope

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Inspection"])


# The tenant a perimeter detection belongs to, looked up once.
#
# Traffic hitting Difaac's own API is Difaac's own estate, so an unauthenticated
# request that trips a rule is recorded against the Difaac tenant. An
# authenticated one is recorded against whoever sent it — `current_tenant()` is
# already set by then for anything that reached a route, though the middleware
# usually runs before that and finds nothing.
_default_tenant_id: int | None = None


def _detection_tenant() -> int | None:
    """Which tenant to write a detection under.

    Without this the write is refused and the detection is lost. The
    inspection middleware runs *before* authentication — that is the point of
    it, since an attacker never authenticates — so no tenant is announced, and
    the row-level policy on `xdr_detections` correctly rejects an insert that
    belongs to nobody. Failing closed is right for a read; for this write it
    meant every detection the engine made was dropped, the console stayed
    empty, and the only trace was an exception the middleware swallowed by
    design.
    """
    global _default_tenant_id

    announced = current_tenant()
    if announced is not None:
        return announced

    if _default_tenant_id is None:
        with get_connection() as conn:
            row = conn.execute(
                "SELECT id FROM tenants WHERE slug = %s", (DEFAULT_TENANT_SLUG,)
            ).fetchone()
        _default_tenant_id = row["id"] if row else None

    return _default_tenant_id


class InspectRequest(BaseModel):
    """A request for the engine to score.

    Bounded because this is the one endpoint that accepts attacker-controlled
    strings by design — the whole point is to be handed hostile input. The
    engine truncates again internally; this bound stops an oversized body
    reaching it at all.
    """

    path: str = Field(max_length=4096)
    query: str = Field(default="", max_length=8192)
    body: str = Field(default="", max_length=32768)
    user_agent: str = Field(default="", max_length=1024)
    source_ip: str | None = Field(default=None, max_length=64)


class Finding(BaseModel):
    rule_id: str
    name: str
    technique: str
    where: str
    evidence: str


class InspectResponse(BaseModel):
    score: int
    action: str
    severity: str
    findings: list[Finding]


def record_detection(
    conn: Any, verdict: Verdict, *, path: str, source: str
) -> None:
    """Write a flagged request into the table the XDR console reads.

    Only the highest-weight finding names the detection: one request that
    trips four rules is one attack, not four, and a console that showed it as
    four would inflate every count an analyst works from.
    """
    if not verdict.findings:
        return
    top = max(verdict.findings, key=lambda f: f.weight)
    conn.execute(
        """
        INSERT INTO xdr_detections (rule, layer, severity, status, host, technique)
        VALUES (%s, 'network', %s, 'open', %s, %s)
        """,
        (f"{top.name} in {top.where}", verdict.severity, f"{source} {path}"[:120], top.technique),
    )
    conn.commit()


@router.post("/inspect", response_model=InspectResponse)
def inspect_request(
    payload: InspectRequest,
    _user: dict = Depends(require_permission(Permission.CONSOLES_READ)),
):
    """Score a request and record it if it is worth an analyst's attention.

    Authenticated: the engine's rule behaviour is useful reconnaissance on its
    own, so an unauthenticated caller must not be able to probe it to find
    which payloads pass.
    """
    verdict = inspect(
        path=payload.path,
        query=payload.query,
        body=payload.body,
        user_agent=payload.user_agent,
    )

    if verdict.score >= FLAG_AT:
        with tenant_scope(_detection_tenant()), get_connection() as conn:
            record_detection(
                conn, verdict, path=payload.path, source=payload.source_ip or "api"
            )

    return InspectResponse(
        score=verdict.score,
        action=verdict.action,
        severity=verdict.severity,
        findings=[
            Finding(
                rule_id=f.rule_id,
                name=f.name,
                technique=f.technique,
                where=f.where,
                evidence=f.evidence,
            )
            for f in verdict.findings
        ],
    )


# Paths the middleware never inspects. The inspect endpoint itself is exempt
# because its body legitimately carries attack payloads — inspecting it would
# make every honest call to it trip every rule.
_EXEMPT_PREFIXES = ("/api/inspect", "/docs", "/redoc", "/openapi.json")


async def inspection_middleware(request: Request, call_next):
    """Inspect every request reaching Difaac's own API.

    Detection only — nothing is blocked here. Difaac's own site is the first
    protected application, and turning on enforcement against live traffic
    before the rules have been observed against it is how a WAF takes a site
    down on its first day. The verdict is recorded; blocking is a deliberate
    later switch, per-site.
    """
    path = request.url.path
    if path.startswith(_EXEMPT_PREFIXES):
        return await call_next(request)

    try:
        verdict = inspect(
            path=path,
            query=request.url.query,
            user_agent=request.headers.get("user-agent", ""),
        )
        if verdict.score >= FLAG_AT:
            client = client_ip(request)
            # Scoped, because this runs before authentication and an insert
            # with no tenant announced is refused by the row-level policy.
            with tenant_scope(_detection_tenant()), get_connection() as conn:
                record_detection(conn, verdict, path=path, source=client)
            logger.warning(
                "Inspection flagged %s from %s: score=%d rules=%s",
                path,
                client,
                verdict.score,
                ",".join(f.rule_id for f in verdict.findings),
            )
    except Exception:
        # Inspection must never be the reason a request fails. A bug in a rule
        # is a detection gap, not an outage.
        logger.exception("Inspection failed for %s; passing the request through", path)

    return await call_next(request)
