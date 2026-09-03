"""Tests for the role and permission model.

The point of these is not that the mapping table has particular contents —
that will change as the product does. It is that the *shape* of the model
holds: no role is accidentally created with nothing, no role other than admin
quietly acquires administration, and an unknown role fails closed.
"""

from __future__ import annotations

import pytest

from app.permissions import Permission, Role, has_permission, permissions_for

# Permissions that must never leak outside an administrator.
ADMIN_ONLY = {
    Permission.USERS_MANAGE,
    Permission.INTEGRATIONS_MANAGE,
    Permission.SETTINGS_MANAGE,
}


class TestPermissionModel:
    def test_every_role_has_permissions(self):
        """A role with an empty set would lock its users out of everything."""
        for role in Role:
            assert permissions_for(role), f"{role} resolves to no permissions"

    def test_admin_holds_everything(self):
        assert permissions_for(Role.ADMIN) == frozenset(Permission)

    @pytest.mark.parametrize("role", [r for r in Role if r is not Role.ADMIN])
    def test_administration_is_admin_only(self, role):
        leaked = ADMIN_ONLY & permissions_for(role)
        assert not leaked, f"{role} should not hold {leaked}"

    def test_viewer_cannot_change_anything(self):
        """Every permission the viewer holds must be a read."""
        for permission in permissions_for(Role.VIEWER):
            assert permission.endswith(":read"), f"viewer holds {permission}"

    def test_unknown_role_fails_closed(self):
        """A typo in the database must deny, not fall back to a default set."""
        assert permissions_for("not-a-real-role") == frozenset()
        assert not has_permission("not-a-real-role", Permission.CONSOLES_READ)

    def test_lead_data_is_restricted(self):
        """Customer contact details are not general workspace data."""
        allowed = {r for r in Role if has_permission(r, Permission.LEADS_READ)}
        assert allowed == {Role.ADMIN, Role.SECURITY_MANAGER}

    def test_only_responders_and_above_resolve_incidents(self):
        allowed = {r for r in Role if has_permission(r, Permission.INCIDENTS_RESOLVE)}
        assert Role.VIEWER not in allowed
        assert Role.ADMIN in allowed
