"""Difaac API — FastAPI + SQLite backend.

This is the main application factory. It registers all routes,
middleware, and initializes the database on startup.
"""

import logging
from contextlib import asynccontextmanager

import fastapi
import fastapi.middleware.cors
from fastapi import Request
from fastapi.responses import JSONResponse

from app.config import CORS_ORIGINS, DEBUG, RATE_LIMIT_AUTH_RPM, RATE_LIMIT_RPM, SENTRY_DSN
from app.database import init_db
from app.rate_limit import rate_limit_middleware
from app.routes import (
    auth,
    blog,
    demo_requests,
    health,
    industries,
    products,
    resources,
    services,
    site_content,
    solutions,
    workspace,
)

# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("difaac.api")

# ---------------------------------------------------------------------------
# Error Tracking
# ---------------------------------------------------------------------------
# sentry_sdk has been a dependency since the project's start but was never
# initialised, so it did nothing. Wiring it here — gated on a DSN actually
# being configured — is what turns it from dead weight into working crash
# reporting. `traces_sample_rate` is 0 in DEBUG: performance tracing is a
# production concern, not something local development needs to pay for.
if SENTRY_DSN:
    import sentry_sdk

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        environment="development" if DEBUG else "production",
        traces_sample_rate=0.0 if DEBUG else 0.1,
        send_default_pii=False,
    )
    logger.info("Sentry error tracking enabled.")


# ---------------------------------------------------------------------------
# App Initialization
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_: fastapi.FastAPI):
    """Initialise the database on startup.

    Uses the lifespan protocol rather than the deprecated ``on_event`` hook.
    """
    logger.info("Starting Difaac API ...")
    init_db()
    logger.info(
        "Rate limits active: %s req/min general, %s req/min on auth endpoints.",
        RATE_LIMIT_RPM,
        RATE_LIMIT_AUTH_RPM,
    )
    yield
    logger.info("Difaac API shutting down.")


app = fastapi.FastAPI(
    title="Difaac API",
    description="Backend API for the Difaac cybersecurity platform.",
    version="1.0.0",
    lifespan=lifespan,
    # The interactive docs are useful in development and are an unnecessary
    # description of the attack surface in production.
    docs_url="/docs" if DEBUG else None,
    redoc_url="/redoc" if DEBUG else None,
    openapi_url="/openapi.json" if DEBUG else None,
)


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

# Registration order matters: Starlette runs the most recently added middleware
# first. Rate limiting is registered before CORS so that CORS ends up on the
# outside and still attaches its headers to a 429 — without that the browser
# cannot read the rejection and reports an opaque network error instead.
app.middleware("http")(rate_limit_middleware)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to every response."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    # This service returns JSON, never a document that loads subresources.
    # `default-src 'self'` would be the policy for a page; the meaningful policy
    # for an API is to forbid the response being framed or treated as content.
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


# ---------------------------------------------------------------------------
# Error Handling
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Prevent stack traces from leaking to the client in production."""
    logger.error("Unhandled exception processing %s: %s", request.url, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


# ---------------------------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    """Service banner.

    The docs link is only advertised when the docs are actually mounted, so the
    production response does not point at an endpoint that returns 404.
    """
    body = {"status": "ok", "service": "Difaac API", "version": app.version}
    if DEBUG:
        body["docs_url"] = "/docs"
    return body

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(products.router)
app.include_router(industries.router)
app.include_router(solutions.router)
app.include_router(services.router)
app.include_router(resources.router)
app.include_router(blog.router)
app.include_router(site_content.router)
# Public write endpoint: a prospective customer has no account yet. Bounded
# by the Pydantic model and rate limited alongside the auth endpoints.
app.include_router(demo_requests.public_router)
# Authenticated SOC data. Registered last so it is easy to see that everything
# above it is public content and everything in it is not.
app.include_router(workspace.router)
app.include_router(demo_requests.private_router)
