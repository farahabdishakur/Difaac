"""Integration API keys, managed from the console.

An administrator issues a key for their own organisation, hands it to the
application that will report events (a hospital's record system, say), and
revokes it if it leaks. Until now this was only possible from `manage_users.py`
on the server, which a hosted deployment with no shell cannot reach — so
onboarding an integration was blocked. This puts it behind the same session
an admin already has.

Every query filters on the caller's tenant explicitly. `api_keys` deliberately
carries no row-level policy — a key has to be found by prefix before anyone
knows whose it is, at authentication time — so isolation here is the
application's job, done by reading the tenant from the session and never from
the request.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app import api_keys
from app.database import get_connection
from app.permissions import Permission
from app.routes.auth import get_current_user, require_permission

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/keys",
    tags=["API Keys"],
    dependencies=[Depends(require_permission(Permission.INTEGRATIONS_MANAGE))],
)


class KeyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class KeyCreated(BaseModel):
    """Returned once, on creation. The full key is never stored or shown again."""

    key: str
    prefix: str
    name: str


class KeySummary(BaseModel):
    prefix: str
    name: str
    created_at: str
    last_used_at: str | None
    revoked_at: str | None


@router.post("", response_model=KeyCreated, status_code=status.HTTP_201_CREATED)
def create_key(payload: KeyCreate, user: dict = Depends(get_current_user)):
    """Issue a key for the caller's tenant. The full value is shown only here."""
    full, prefix, key_hash = api_keys.generate()
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO api_keys (tenant_id, name, prefix, key_hash, created_by)"
            " VALUES (%s, %s, %s, %s, %s)",
            (user["tenant_id"], payload.name, prefix, key_hash, user["email"]),
        )
        conn.commit()
    logger.info("API key %s issued for tenant %s by %s", prefix, user["tenant_id"], user["email"])
    return KeyCreated(key=full, prefix=prefix, name=payload.name)


@router.get("", response_model=list[KeySummary])
def list_keys(user: dict = Depends(get_current_user)):
    """Every key for the caller's tenant. Never the secret — only its prefix."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT prefix, name, created_at, last_used_at, revoked_at"
            " FROM api_keys WHERE tenant_id = %s ORDER BY created_at DESC",
            (user["tenant_id"],),
        ).fetchall()
    return [
        KeySummary(
            prefix=r["prefix"],
            name=r["name"],
            created_at=r["created_at"].isoformat(),
            last_used_at=r["last_used_at"].isoformat() if r["last_used_at"] else None,
            revoked_at=r["revoked_at"].isoformat() if r["revoked_at"] else None,
        )
        for r in rows
    ]


@router.delete("/{prefix}", status_code=status.HTTP_200_OK)
def revoke_key(prefix: str, user: dict = Depends(get_current_user)):
    """Revoke a key. Scoped to the caller's tenant, so one org cannot revoke
    another's even by guessing a prefix."""
    with get_connection() as conn:
        cur = conn.execute(
            "UPDATE api_keys SET revoked_at = now()"
            " WHERE prefix = %s AND tenant_id = %s AND revoked_at IS NULL",
            (prefix, user["tenant_id"]),
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active key with that prefix",
            )
    logger.info("API key %s revoked by %s", prefix, user["email"])
    return {"detail": "Key revoked. It stops working immediately."}
