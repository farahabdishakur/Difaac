import { useAuthUser } from '@/hooks/use-auth'

/**
 * The permissions the platform recognises.
 *
 * Mirrors `Permission` in `backend/app/permissions.py`. Kept as a const object
 * rather than free-floating strings so a typo in a route guard is a compile
 * error instead of a silently hidden menu item.
 */
export const PERMISSION = {
  intelRead: 'intel:read',
  intelExport: 'intel:export',
  alertsRead: 'alerts:read',
  alertsAssign: 'alerts:assign',
  alertsResolve: 'alerts:resolve',
  incidentsRead: 'incidents:read',
  incidentsCreate: 'incidents:create',
  incidentsAssign: 'incidents:assign',
  incidentsResolve: 'incidents:resolve',
  consolesRead: 'consoles:read',
  leadsRead: 'leads:read',
  reportsRead: 'reports:read',
  reportsGenerate: 'reports:generate',
  usersManage: 'users:manage',
  integrationsManage: 'integrations:manage',
  settingsManage: 'settings:manage',
  auditRead: 'audit:read',
} as const

export type PermissionName = (typeof PERMISSION)[keyof typeof PERMISSION]

/**
 * Whether the signed-in user holds a permission.
 *
 * Use this to decide what to *render*. It is not a security boundary: the API
 * refuses the call regardless of what the client drew, and hiding a control
 * only spares the user a button that would fail.
 */
export function useHasPermission(permission: PermissionName): boolean {
  const user = useAuthUser()
  return user?.permissions?.includes(permission) ?? false
}
