"""Roles and permissions for the Difaac platform.

Every role in the product is defined here, and every role is defined as a set
of permissions rather than as a name that code compares against. That
distinction matters: `if user.role == "admin"` scattered through the routes is
how a permission model rots, because adding a seventh role then means finding
every one of those comparisons. A route asks for the permission it needs, and
the mapping below decides which roles hold it.

Enforcement is server-side and only server-side. The frontend reads a user's
permissions to decide what to render, but hiding a button is a courtesy, not a
control — the API refuses the call regardless of what the client drew.
"""

from __future__ import annotations

from enum import StrEnum


class Permission(StrEnum):
    """A single thing a user may do.

    Named `subject:verb` so a route's requirement reads as a sentence and the
    set a role holds can be scanned quickly for anything it should not.
    """

    # Threat intelligence
    INTEL_READ = "intel:read"
    INTEL_EXPORT = "intel:export"

    # Alerts
    ALERTS_READ = "alerts:read"
    ALERTS_ASSIGN = "alerts:assign"
    ALERTS_RESOLVE = "alerts:resolve"

    # Incidents and cases
    INCIDENTS_READ = "incidents:read"
    INCIDENTS_CREATE = "incidents:create"
    INCIDENTS_ASSIGN = "incidents:assign"
    INCIDENTS_RESOLVE = "incidents:resolve"

    # Attack surface, fraud, brand, email — the product consoles
    CONSOLES_READ = "consoles:read"

    # Leads captured from the marketing site
    LEADS_READ = "leads:read"

    # Reporting
    REPORTS_READ = "reports:read"
    REPORTS_GENERATE = "reports:generate"

    # Administration
    USERS_MANAGE = "users:manage"
    INTEGRATIONS_MANAGE = "integrations:manage"
    SETTINGS_MANAGE = "settings:manage"
    AUDIT_READ = "audit:read"


class Role(StrEnum):
    """The roles the product ships.

    `ADMIN` and `ANALYST` keep their existing string values because accounts
    already carry them; renaming those would orphan every current user for no
    gain.
    """

    ADMIN = "admin"
    SECURITY_MANAGER = "security_manager"
    ANALYST = "analyst"
    INTEL_ANALYST = "intel_analyst"
    INCIDENT_RESPONDER = "incident_responder"
    VIEWER = "viewer"


# The permissions every signed-in user holds, whatever their role. Kept
# separate so a new role cannot accidentally be created with no read access at
# all, and so the per-role sets below only list what is *additional*.
_BASE: frozenset[Permission] = frozenset(
    {
        Permission.INTEL_READ,
        Permission.ALERTS_READ,
        Permission.INCIDENTS_READ,
        Permission.CONSOLES_READ,
        Permission.REPORTS_READ,
    }
)

_INVESTIGATION: frozenset[Permission] = frozenset(
    {
        Permission.ALERTS_ASSIGN,
        Permission.ALERTS_RESOLVE,
        Permission.INCIDENTS_CREATE,
        Permission.INCIDENTS_ASSIGN,
        Permission.INCIDENTS_RESOLVE,
        Permission.INTEL_EXPORT,
    }
)

ROLE_PERMISSIONS: dict[Role, frozenset[Permission]] = {
    # Everything. Deliberately written as "all of them" rather than a list to
    # copy, so a permission added later is not silently withheld from admins.
    Role.ADMIN: frozenset(Permission),
    # Runs the team: sees the work and the reporting, and can direct it, but
    # has no reason to hold user or integration administration.
    Role.SECURITY_MANAGER: _BASE
    | {
        Permission.ALERTS_ASSIGN,
        Permission.INCIDENTS_ASSIGN,
        Permission.INCIDENTS_CREATE,
        Permission.REPORTS_GENERATE,
        Permission.LEADS_READ,
        Permission.AUDIT_READ,
    },
    # Works the queue end to end.
    Role.ANALYST: _BASE | _INVESTIGATION,
    # Same investigative work, oriented at intelligence rather than response;
    # separated from ANALYST so export can be governed differently later.
    Role.INTEL_ANALYST: _BASE
    | {
        Permission.INTEL_EXPORT,
        Permission.ALERTS_ASSIGN,
        Permission.INCIDENTS_CREATE,
    },
    # Owns incidents specifically, and cannot bulk-export intelligence.
    Role.INCIDENT_RESPONDER: _BASE
    | {
        Permission.ALERTS_ASSIGN,
        Permission.ALERTS_RESOLVE,
        Permission.INCIDENTS_CREATE,
        Permission.INCIDENTS_ASSIGN,
        Permission.INCIDENTS_RESOLVE,
    },
    # Read-only. Holds exactly the base set and nothing else.
    Role.VIEWER: _BASE,
}


def permissions_for(role: str) -> frozenset[Permission]:
    """Every permission a role holds.

    An unrecognised role gets nothing rather than a default set. A typo in the
    database should lock an account out visibly, not quietly grant it whatever
    the fallback happened to be.
    """
    try:
        return ROLE_PERMISSIONS[Role(role)]
    except ValueError:
        return frozenset()


def has_permission(role: str, permission: Permission) -> bool:
    return permission in permissions_for(role)
