"""Pydantic response models for every API entity.

These models enforce the exact JSON shape the frontend expects.
They also appear automatically in the interactive API docs at /docs.
"""

import re

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
    date: str
    category: str


# -- Testimonials -----------------------------------------------------------

class TestimonialResponse(BaseModel):
    """Customer testimonial quote."""
    quote: str
    name: str
    title: str
    company: str


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
    created_at: str


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


class MessageResponse(BaseModel):
    """Simple acknowledgement for actions with nothing to return."""
    detail: str


class SessionResponse(BaseModel):
    """One active refresh-token session belonging to the current user."""
    id: int
    issued_at: str
    expires_at: str
    ip_address: str | None = None
    user_agent: str | None = None
    current: bool = False

