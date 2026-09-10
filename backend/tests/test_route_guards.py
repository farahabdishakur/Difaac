"""Every route, and the guard in front of it.

The other test modules assert that specific endpoints refuse specific callers.
This one asserts something the others cannot: that no route was *added* without
a guard. That is the failure that actually happens — not someone deleting a
permission check, but someone writing a new endpoint next to twenty protected
ones and forgetting that the protection came from a decorator rather than from
the neighbourhood.

`/auth/register` is why this module exists. It sat among the authentication
routes, looked like the rest of them, and was reachable by anyone; because its
insert left `tenant_id` to a column default that falls back to the `difaac`
tenant, an anonymous caller received an `analyst` account with read access to
that tenant's entire console. Nothing failed. A test that enumerated the routes
and their guards would have shown it on the first run.

No database is needed: the guards are read off the application object, which
is built at import time.
"""

from __future__ import annotations

import os

import pytest

os.environ.setdefault("DIFAAC_DEBUG", "true")

from app.main import app  # noqa: E402
from app.permissions import Permission  # noqa: E402

# Routes an unauthenticated caller may reach, and why each one is here.
#
# This is an allowlist, not a description. A route that is public and not in
# this set fails the test, which is the point: making an endpoint public should
# take an edit to this file, where the reason has to be written down.
PUBLIC_WRITES = {
    # Credential endpoints. Nobody has a session yet, by definition. Each is in
    # the rate limiter's strict bucket.
    ("POST", "/auth/login"),
    ("POST", "/auth/forgot-password"),
    ("POST", "/auth/reset-password"),
    # Authenticated by the refresh cookie rather than a bearer token, so they
    # read as public here. The cookie is HttpOnly and its token is 256 bits.
    ("POST", "/auth/refresh"),
    ("POST", "/auth/logout"),
    # A prospective customer has no account. Bounded by its Pydantic model and
    # rate limited alongside the credential endpoints.
    ("POST", "/api/demo-requests"),
}

# Public reads: the marketing site, which has to render for a signed-out
# visitor, plus the health check an orchestrator calls.
PUBLIC_READS = {
    "/",
    "/health",
    "/api/blog",
    "/api/products",
    "/api/products/{slug}",
    "/api/solutions",
    "/api/solutions/{slug}",
    "/api/services",
    "/api/services/{slug}",
    "/api/industries",
    "/api/industries/{slug}",
    "/api/resources",
    "/api/resources/{slug}",
    "/api/site-content",
}


def _walk(routes):
    """Yield every APIRoute, descending through included routers."""
    for route in routes:
        original = getattr(route, "original_router", None)
        if original is not None:
            yield from _walk(original.routes)
        elif hasattr(route, "dependant"):
            yield route


def _guards(route) -> set[str]:
    """The names of the guards standing in front of `route`.

    `require_permission` is a closure over the permission it requires, so the
    permission is read out of the closure's cells rather than from a name the
    route happens to carry.
    """
    found: set[str] = set()
    for dependency in route.dependant.dependencies:
        call = getattr(dependency, "call", None)
        for cell in getattr(call, "__closure__", None) or ():
            try:
                contents = cell.cell_contents
            except ValueError:  # pragma: no cover - an empty cell
                continue
            if isinstance(contents, Permission):
                found.add(str(contents))
        name = getattr(call, "__name__", "")
        if name == "get_current_user":
            found.add("authenticated")
        if name == "require_api_key":
            found.add("api-key")
    return found


ROUTES = [
    (method, route.path, frozenset(_guards(route)))
    for route in _walk(app.routes)
    for method in sorted(route.methods - {"HEAD", "OPTIONS"})
]


def _guards_for(method: str, path: str) -> frozenset[str]:
    for m, p, g in ROUTES:
        if m == method and p == path:
            return g
    raise AssertionError(f"{method} {path} is not registered")


class TestNothingIsAccidentallyPublic:
    def test_the_route_table_is_not_empty(self):
        """A guard test that enumerates nothing passes for the wrong reason."""
        assert len(ROUTES) > 30

    @pytest.mark.parametrize(
        "method,path", [(m, p) for m, p, g in ROUTES if not g and m != "GET"]
    )
    def test_every_public_write_is_deliberate(self, method, path):
        assert (method, path) in PUBLIC_WRITES, (
            f"{method} {path} accepts a write from anyone. If that is intended, "
            "add it to PUBLIC_WRITES with the reason; otherwise give it a guard."
        )

    @pytest.mark.parametrize("path", sorted({p for m, p, g in ROUTES if not g and m == "GET"}))
    def test_every_public_read_is_deliberate(self, path):
        assert path in PUBLIC_READS, (
            f"GET {path} serves anyone. Marketing content is public by design; "
            "customer data is not."
        )


class TestTheGuardsThatMatterMost:
    def test_account_creation_requires_user_administration(self):
        """The regression this whole module was written for."""
        assert "users:manage" in _guards_for("POST", "/auth/register")

    def test_the_record_access_trail_requires_audit_read(self):
        """Not `consoles:read`, which every role including `viewer` holds."""
        assert "audit:read" in _guards_for("GET", "/api/app-events")

    def test_lead_contact_details_require_leads_read(self):
        assert "leads:read" in _guards_for("GET", "/api/demo-requests")

    def test_ingest_is_authenticated_by_key(self):
        """An application has nobody to sign it in, but it is not anonymous."""
        assert "api-key" in _guards_for("POST", "/api/ingest/events")

    @pytest.mark.parametrize(
        "path",
        [
            "/api/ti/iocs",
            "/api/ti/actors",
            "/api/ti/alerts",
            "/api/drp/phishing",
            "/api/fraud/cases",
            "/api/incidents",
            "/api/xdr/detections",
            "/api/asm/assets",
            "/api/bep/messages",
            "/api/overview/executive",
        ],
    )
    def test_console_data_is_never_anonymous(self, path):
        assert _guards_for("GET", path), f"GET {path} has no guard at all"


class TestThePermissionModelIsNotDecorative:
    """A permission nothing enforces is a promise the product does not keep.

    `permissions.py` describes six roles with distinct sets, and the console
    routes were all behind one blanket `consoles:read` -- which every role
    holds. A role built deliberately without `incidents:read` was handed the
    incidents anyway. Nothing escalated, because every role happens to hold
    the whole base set today, but the table and the enforcement disagreed, and
    the first role that narrowed one of them would have found out the hard
    way.
    """

    # The route that serves each kind of data, and the permission that names
    # it. Read data, not enforcement: the assertions below check the two agree.
    EXPECTED = {
        "/api/ti/iocs": "intel:read",
        "/api/ti/actors": "intel:read",
        "/api/ti/summary": "intel:read",
        "/api/ti/alerts": "alerts:read",
        "/api/incidents": "incidents:read",
        "/api/overview/executive": "reports:read",
        "/api/overview/trend": "reports:read",
        "/api/app-events": "audit:read",
        "/api/demo-requests": "leads:read",
    }

    @pytest.mark.parametrize("path,permission", sorted(EXPECTED.items()))
    def test_the_route_asks_for_the_permission_that_names_its_data(self, path, permission):
        assert permission in _guards_for("GET", path)

    def test_no_read_permission_is_left_unenforced(self):
        """Every `*:read` in the model is claimed by at least one route.

        If a permission is added to the table and no route ever asks for it,
        the role that was narrowed to exclude it gains nothing -- this catches
        that at the moment the permission is introduced rather than months
        later.
        """
        enforced = {g for _, _, guards in ROUTES for g in guards}
        declared = {str(p) for p in Permission if str(p).endswith(":read")}
        unenforced = declared - enforced
        assert not unenforced, (
            f"declared but no route requires them: {sorted(unenforced)}. "
            "Either gate a route with each, or remove them from permissions.py."
        )
