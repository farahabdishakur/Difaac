"""Authentication API routes.

Registration, login, refresh-token rotation, logout, session management, and
password change.

Two decisions shape everything here:

  * The access token is short-lived and never revocable; the refresh token is
    long-lived, stored hashed, and revocable at any moment. Continuity comes
    from the refresh token, not from a long access-token lifetime.

  * Failure responses never distinguish "no such account" from "wrong
    password", and both paths cost the same time. Login is the one endpoint an
    unauthenticated caller can always reach, so it must not answer questions
    about who has an account.
"""

from __future__ import annotations

import logging
import sqlite3
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app import auth_service
from app.auth_utils import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
    waste_password_comparison,
)
from app.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    COOKIE_SAMESITE,
    COOKIE_SECURE,
    REFRESH_COOKIE_NAME,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from app.database import get_connection
from app.models import (
    MessageResponse,
    PasswordChangeRequest,
    SessionResponse,
    TokenResponse,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

security = HTTPBearer(auto_error=True)

# Role granted to every self-registered account. Anything more privileged is
# granted out of band, never through the public signup endpoint.
DEFAULT_USER_ROLE = "analyst"

# One message for every credential failure. Saying "no such user" would turn
# this endpoint into a directory of who holds an account.
_INVALID_CREDENTIALS = "Incorrect email or password"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _row_to_profile(row: sqlite3.Row) -> dict:
    return {
        "email": row["email"],
        "full_name": row["full_name"],
        "role": row["role"],
        "created_at": row["created_at"],
    }


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


def _user_agent(request: Request) -> str | None:
    return request.headers.get("user-agent")


def _set_refresh_cookie(response: Response, token: str) -> None:
    """Attach the refresh token as an HttpOnly cookie.

    HttpOnly keeps it out of reach of page scripts, so an XSS flaw cannot steal
    a long-lived credential. The path restriction means it is only ever sent to
    the endpoints that need it.
    """
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/auth",
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/auth")


def _token_response(user_row: sqlite3.Row) -> dict:
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user_row["email"], role=user_row["role"], expires_delta=expires_delta
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": int(expires_delta.total_seconds()),
        "user": _row_to_profile(user_row),
    }


def _unauthorised(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Resolve the authenticated user from the bearer token.

    The account is re-read on every request rather than trusted from the token
    body, so deactivating an account takes effect immediately instead of when
    the token happens to expire.
    """
    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise _unauthorised("Could not validate credentials")

    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT id, email, full_name, role, created_at, is_active
              FROM users WHERE email = ?
            """,
            (payload["sub"],),
        ).fetchone()

    if not row:
        raise _unauthorised("Could not validate credentials")
    if not row["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account"
        )

    profile = _row_to_profile(row)
    profile["id"] = row["id"]
    return profile


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

@router.post(
    "/register", response_model=UserProfileResponse, status_code=status.HTTP_201_CREATED
)
async def register(payload: UserRegisterRequest, request: Request):
    """Register a new account.

    The role is assigned here and is never read from the request body.
    """
    email = payload.email
    hashed = hash_password(payload.password)

    with get_connection() as conn:
        exists = conn.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone()
        if exists:
            auth_service.record_event(
                conn,
                "register_duplicate",
                email=email,
                ip_address=_client_ip(request),
                user_agent=_user_agent(request),
            )
            conn.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this corporate email already exists",
            )

        try:
            cursor = conn.execute(
                """
                INSERT INTO users (email, hashed_password, full_name, role, password_changed_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                (email, hashed, payload.full_name, DEFAULT_USER_ROLE),
            )
            auth_service.record_event(
                conn,
                "register",
                email=email,
                user_id=cursor.lastrowid,
                ip_address=_client_ip(request),
                user_agent=_user_agent(request),
            )
            conn.commit()

            row = conn.execute(
                "SELECT email, full_name, role, created_at FROM users WHERE email = ?",
                (email,),
            ).fetchone()
        except sqlite3.Error as exc:
            conn.rollback()
            logger.error("Failed to register user %s: %s", email, exc)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Registration could not be completed",
            )

    logger.info("Registered new user: %s (role: %s)", email, DEFAULT_USER_ROLE)
    return _row_to_profile(row)


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest, request: Request, response: Response):
    """Authenticate and start a session."""
    email = payload.email
    ip = _client_ip(request)
    agent = _user_agent(request)

    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT id, email, hashed_password, full_name, role, created_at,
                   is_active, failed_login_attempts, locked_until
              FROM users WHERE email = ?
            """,
            (email,),
        ).fetchone()

        if row is None:
            # Spend the same time as a real verification so that timing does
            # not disclose whether this address is registered.
            waste_password_comparison()
            auth_service.record_event(
                conn, "login_failure", email=email, detail="unknown_account",
                ip_address=ip, user_agent=agent,
            )
            conn.commit()
            raise _unauthorised(_INVALID_CREDENTIALS)

        remaining = auth_service.lockout_remaining(row)
        if remaining > 0:
            auth_service.record_event(
                conn, "login_blocked", email=email, user_id=row["id"],
                detail=f"locked_for_{remaining}s", ip_address=ip, user_agent=agent,
            )
            conn.commit()
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Account temporarily locked after repeated failed attempts.",
                headers={"Retry-After": str(remaining)},
            )

        if not verify_password(payload.password, row["hashed_password"]):
            locked = auth_service.register_failed_login(conn, row["id"])
            auth_service.record_event(
                conn, "login_failure", email=email, user_id=row["id"],
                detail="locked" if locked else "bad_password",
                ip_address=ip, user_agent=agent,
            )
            conn.commit()
            if locked:
                logger.warning("Account locked after repeated failures: %s", email)
            raise _unauthorised(_INVALID_CREDENTIALS)

        # Checked after the password so that an attacker cannot use the
        # response to discover which accounts exist but are disabled.
        if not row["is_active"]:
            auth_service.record_event(
                conn, "login_blocked", email=email, user_id=row["id"],
                detail="inactive", ip_address=ip, user_agent=agent,
            )
            conn.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="User account is deactivated"
            )

        auth_service.clear_failed_logins(conn, row["id"])
        refresh_token, _ = auth_service.issue_refresh_token(
            conn, row["id"], ip_address=ip, user_agent=agent
        )
        auth_service.record_event(
            conn, "login_success", email=email, user_id=row["id"],
            ip_address=ip, user_agent=agent,
        )
        conn.commit()

    _set_refresh_cookie(response, refresh_token)
    logger.info("User signed in: %s", email)
    return _token_response(row)


# ---------------------------------------------------------------------------
# Refresh
# ---------------------------------------------------------------------------

@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: Request, response: Response):
    """Exchange a refresh token for a new access token.

    The presented token is rotated: it is marked used and a replacement is
    issued in the same family. Presenting an already-used token indicates the
    token was captured, and revokes the whole family.
    """
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise _unauthorised("No active session")

    ip = _client_ip(request)
    agent = _user_agent(request)

    with get_connection() as conn:
        outcome = auth_service.consume_refresh_token(conn, token)

        if not outcome.ok:
            if outcome.status == "reused":
                auth_service.record_event(
                    conn, "refresh_reuse_detected", user_id=outcome.user_id,
                    detail=f"family={outcome.family_id}", ip_address=ip, user_agent=agent,
                )
            else:
                auth_service.record_event(
                    conn, "refresh_rejected", user_id=outcome.user_id,
                    detail=outcome.status, ip_address=ip, user_agent=agent,
                )
            conn.commit()
            _clear_refresh_cookie(response)
            raise _unauthorised("Session expired. Please sign in again.")

        row = conn.execute(
            """
            SELECT id, email, full_name, role, created_at, is_active
              FROM users WHERE id = ?
            """,
            (outcome.user_id,),
        ).fetchone()

        if row is None or not row["is_active"]:
            auth_service.revoke_family(conn, outcome.family_id or "")
            conn.commit()
            _clear_refresh_cookie(response)
            raise _unauthorised("Session is no longer valid")

        new_token, _ = auth_service.issue_refresh_token(
            conn, row["id"], family_id=outcome.family_id, ip_address=ip, user_agent=agent
        )
        auth_service.record_event(
            conn, "refresh", email=row["email"], user_id=row["id"],
            ip_address=ip, user_agent=agent,
        )
        conn.commit()

    _set_refresh_cookie(response, new_token)
    return _token_response(row)


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------

@router.post("/logout", response_model=MessageResponse)
async def logout(request: Request, response: Response):
    """End the current session by revoking its refresh token.

    Deliberately unauthenticated: signing out must work even when the access
    token has already expired.
    """
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if token:
        with get_connection() as conn:
            auth_service.revoke_token(conn, token)
            auth_service.record_event(
                conn, "logout", ip_address=_client_ip(request), user_agent=_user_agent(request)
            )
            conn.commit()

    _clear_refresh_cookie(response)
    return {"detail": "Signed out"}


@router.post("/logout-all", response_model=MessageResponse)
async def logout_all(
    request: Request, response: Response, current_user: dict = Depends(get_current_user)
):
    """Revoke every session for the current account, on all devices."""
    with get_connection() as conn:
        revoked = auth_service.revoke_all_for_user(conn, current_user["id"])
        auth_service.record_event(
            conn, "logout_all", email=current_user["email"], user_id=current_user["id"],
            detail=f"revoked={revoked}", ip_address=_client_ip(request),
            user_agent=_user_agent(request),
        )
        conn.commit()

    _clear_refresh_cookie(response)
    return {"detail": f"Signed out of {revoked} session(s)"}


# ---------------------------------------------------------------------------
# Profile and sessions
# ---------------------------------------------------------------------------

@router.get("/me", response_model=UserProfileResponse)
async def read_current_user(current_user: dict = Depends(get_current_user)):
    """Return the profile of the authenticated account."""
    return current_user


@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions(request: Request, current_user: dict = Depends(get_current_user)):
    """List active sessions so a user can see where they are signed in."""
    with get_connection() as conn:
        return auth_service.list_sessions(
            conn, current_user["id"], request.cookies.get(REFRESH_COOKIE_NAME)
        )


# ---------------------------------------------------------------------------
# Password change
# ---------------------------------------------------------------------------

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    payload: PasswordChangeRequest,
    request: Request,
    response: Response,
    current_user: dict = Depends(get_current_user),
):
    """Change the password, then invalidate every existing session.

    Revoking sessions is the point of the operation as much as the new password
    is: someone changing their password because it may be known needs the other
    party signed out, not merely locked out of future logins.
    """
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, email, hashed_password FROM users WHERE id = ?",
            (current_user["id"],),
        ).fetchone()

        if row is None or not verify_password(payload.current_password, row["hashed_password"]):
            auth_service.record_event(
                conn, "password_change_failed", email=current_user["email"],
                user_id=current_user["id"], ip_address=_client_ip(request),
                user_agent=_user_agent(request),
            )
            conn.commit()
            raise _unauthorised("Current password is incorrect")

        if verify_password(payload.new_password, row["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must differ from the current password",
            )

        conn.execute(
            """
            UPDATE users
               SET hashed_password = ?, password_changed_at = CURRENT_TIMESTAMP,
                   failed_login_attempts = 0, locked_until = NULL
             WHERE id = ?
            """,
            (hash_password(payload.new_password), row["id"]),
        )
        auth_service.revoke_all_for_user(conn, row["id"])
        auth_service.record_event(
            conn, "password_changed", email=row["email"], user_id=row["id"],
            ip_address=_client_ip(request), user_agent=_user_agent(request),
        )
        conn.commit()

    _clear_refresh_cookie(response)
    logger.info("Password changed for %s; all sessions revoked", current_user["email"])
    return {"detail": "Password updated. Please sign in again."}
