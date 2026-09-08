"""Pydantic response models for every API entity.

These models enforce the exact JSON shape the frontend expects.
They also appear automatically in the interactive API docs at /docs.
"""

import re

from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

# Password bounds. The upper bound matters as well as the lower: bcrypt only
# considers the first 72 bytes, and hashing an unbounded string is a cheap way
# for a caller to burn server CPU.
MIN_PASSWORD_LENGTH = 12
MAX_PASSWORD_LENGTH = 128

# Deliberately permissive. Real deliverability is proven by sending mail, not
# by a regex, so this only rejects input that is clearly not an address.
_EMAIL_RE = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def _normalise_email_value(value: str) -> str:
    """Trim and lower-case an email so lookups match regardless of casing."""
    return value.strip().lower()


# -- Products ---------------------------------------------------------------

class CapabilityItem(BaseModel):
    """A single product capability (title + description)."""
    title: str
    description: str


class ProductResponse(BaseModel):
    """Full product representation returned by the API."""
    slug: str
    name: str
    tagline: str
    description: str
    icon: str
    bullets: list[str]
    capabilities: list[CapabilityItem]


# -- Industries -------------------------------------------------------------

class IndustryResponse(BaseModel):
    """Industry vertical served by Difaac."""
    slug: str
    name: str
    tagline: str
    description: str
    icon: str


# -- Solutions --------------------------------------------------------------

class SolutionResponse(BaseModel):
    """Solution grouped by use-case or role."""
    slug: str
    name: str
    group: str
    tagline: str
    description: str
    icon: str
    highlights: list[str] | None = None


# -- Services ---------------------------------------------------------------

class ServiceResponse(BaseModel):
    """Professional service offering."""
    slug: str
    name: str
    group: str
    tagline: str
    description: str
    icon: str


# -- Resources --------------------------------------------------------------

class ResourceResponse(BaseModel):
    """Downloadable resource (report, white paper, etc.)."""
    slug: str
    title: str
    type: str
    excerpt: str
    isNew: bool


# -- Blog -------------------------------------------------------------------

class BlogPostResponse(BaseModel):
    """Blog article summary."""
    slug: str
    title: str
    excerpt: str
    date: date
    category: str


# -- Authentication ---------------------------------------------------------

class UserLoginRequest(BaseModel):
    """Payload sent by client to authenticate."""
    email: str
    password: str

    _normalise_email = field_validator("email")(_normalise_email_value)


class UserRegisterRequest(BaseModel):
    """Payload sent by client to register a new account.

    Deliberately has no ``role`` field: the role is assigned by the server in
    the register route. Accepting it from the client would let anyone register
    themselves as an administrator.
    """
    email: str
    password: str = Field(min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)
    full_name: str | None = Field(default=None, max_length=200)

    _normalise_email = field_validator("email")(_normalise_email_value)

    @field_validator("email")
    @classmethod
    def _check_email_shape(cls, value: str) -> str:
        if not _EMAIL_RE.fullmatch(value):
            raise ValueError("Enter a valid email address")
        return value


class UserProfileResponse(BaseModel):
    """Safe user profile response without password hashes."""
    email: str
    full_name: str | None = None
    role: str
    created_at: datetime
    # What this account may actually do. The client renders from this rather
    # than from `role`, so a permission moving between roles needs no client
    # release. Enforcement is still server-side on every endpoint.
    permissions: list[str] = []


class TokenResponse(BaseModel):
    """Returned on successful authentication and on refresh.

    `access_token` and `user` are the fields the web client reads, and their
    names are part of the published contract — do not rename them.

    The refresh token is deliberately absent from this body. It is set as an
    HttpOnly cookie so that script running on the page, including anything
    injected through XSS, cannot read it.
    """
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserProfileResponse


class PasswordChangeRequest(BaseModel):
    """Payload for changing the password of the authenticated account."""
    current_password: str
    new_password: str = Field(min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)


class ForgotPasswordRequest(BaseModel):
    """Payload to request a password reset link."""
    email: str

    _normalise_email = field_validator("email")(_normalise_email_value)


class ResetPasswordRequest(BaseModel):
    """Payload to complete a password reset with the token from the link."""
    token: str
    new_password: str = Field(min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)


class MessageResponse(BaseModel):
    """Simple acknowledgement for actions with nothing to return."""
    detail: str


# -- Demo requests -----------------------------------------------------------

class DemoRequestCreate(BaseModel):
    """A demo request submitted from a product page.

    Every field is bounded. This endpoint is reachable without
    authentication, so an unbounded string here is a way for any caller to
    write arbitrarily large rows into the database.
    """
    # Usually one slug, but the general "Talk to Sales" form (as opposed to a
    # single product page's demo form) lets a visitor flag several products
    # at once and stores them here comma-joined — 300 chars comfortably
    # covers all six current product slugs joined together with room to grow.
    product_slug: str = Field(min_length=1, max_length=300)
    name: str = Field(min_length=1, max_length=120)
    company: str = Field(min_length=1, max_length=160)
    email: str = Field(min_length=3, max_length=254)
    role: str = Field(min_length=1, max_length=120)
    context: str | None = Field(default=None, max_length=1000)

    _normalise_email = field_validator("email")(_normalise_email_value)

    @field_validator("email")
    @classmethod
    def _check_email_shape(cls, value: str) -> str:
        if not _EMAIL_RE.fullmatch(value):
            raise ValueError("Enter a valid email address")
        return value


class DemoRequestResponse(BaseModel):
    """One demo request, as shown in the SOC workspace."""
    id: int
    product_slug: str
    name: str
    company: str
    email: str
    role: str
    context: str | None = None
    status: str
    created_at: datetime


class SessionResponse(BaseModel):
    """One active refresh-token session belonging to the current user."""
    id: int
    issued_at: datetime
    expires_at: datetime
    ip_address: str | None = None
    user_agent: str | None = None
    current: bool = False


MAX_EVENTS_PER_BATCH = 500


class AppEvent(BaseModel):
    """One security-relevant thing that happened inside a customer's system.

    The vocabulary is deliberately open. Every application names its actions
    differently, and forcing a hospital's record system into a fixed taxonomy
    would either lose what it was trying to say or stop it reporting at all.
    What is constrained is length and shape, so a malformed integration cannot
    fill the table with one enormous row.

    `subject_ref` is the field to be careful with. It says which record was
    touched, and for a hospital that is the whole value of the audit trail —
    but it must be an identifier, never the patient's name. Difaac does not
    want that data and should not be storing it.
    """

    source: str = Field(min_length=1, max_length=120)
    action: str = Field(min_length=1, max_length=120)
    outcome: str = Field(min_length=1, max_length=40)
    severity: str = Field(default="info", max_length=20)
    actor: str | None = Field(default=None, max_length=200)
    subject_ref: str | None = Field(default=None, max_length=200)
    ip_address: str | None = Field(default=None, max_length=64)
    user_agent: str | None = Field(default=None, max_length=400)
    detail: str | None = Field(default=None, max_length=2000)
    occurred_at: datetime

    @field_validator("severity")
    @classmethod
    def known_severity(cls, value: str) -> str:
        allowed = {"info", "low", "medium", "high", "critical"}
        lowered = value.strip().lower()
        if lowered not in allowed:
            raise ValueError(f"severity must be one of {sorted(allowed)}")
        return lowered

    @field_validator("outcome")
    @classmethod
    def known_outcome(cls, value: str) -> str:
        allowed = {"success", "failure", "denied", "error"}
        lowered = value.strip().lower()
        if lowered not in allowed:
            raise ValueError(f"outcome must be one of {sorted(allowed)}")
        return lowered


class AppEventBatch(BaseModel):
    """A batch of events. Capped, because an application under attack sends
    more than one at rest, and that is exactly when this path must hold."""

    events: list[AppEvent] = Field(min_length=1, max_length=MAX_EVENTS_PER_BATCH)
