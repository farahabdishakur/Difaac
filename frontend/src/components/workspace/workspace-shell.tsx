import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Radar,
  Fingerprint,
  ShieldAlert,
  Siren,
  Inbox,
  Settings,
  LogOut,
  Activity,
  Globe,
  Mail,
  FileClock,
} from 'lucide-react'
import { LogoMark } from '@/components/layout/logo-mark'
import { useAuthUser } from '@/hooks/use-auth'
import { PERMISSION, type PermissionName } from '@/hooks/use-permission'
import { signOut } from '@/lib/auth'
import { useSeo } from '@/lib/seo'

// The six products first, in the order they appear on the marketing site, so
// a customer who bought "Attack Surface Management" finds a console with that
// exact name in the same position. Everything after the rule is workspace
// plumbing rather than a product.
type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end: boolean
  /** Hidden unless the signed-in account holds this. Omit for always-visible. */
  requires?: PermissionName
}

const navItems: NavItem[] = [
  { to: '/workspace', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/workspace/threat-intelligence', label: 'Threat Intelligence', icon: Radar, end: false, requires: PERMISSION.intelRead },
  { to: '/workspace/fraud', label: 'Fraud Protection', icon: ShieldAlert, end: false, requires: PERMISSION.consolesRead },
  { to: '/workspace/managed-xdr', label: 'Managed XDR', icon: Activity, end: false, requires: PERMISSION.consolesRead },
  { to: '/workspace/attack-surface', label: 'Attack Surface', icon: Globe, end: false, requires: PERMISSION.consolesRead },
  { to: '/workspace/digital-risk', label: 'Digital Risk', icon: Fingerprint, end: false, requires: PERMISSION.consolesRead },
  { to: '/workspace/email-protection', label: 'Email Protection', icon: Mail, end: false, requires: PERMISSION.consolesRead },
  { to: '/workspace/incidents', label: 'Incidents', icon: Siren, end: false, requires: PERMISSION.incidentsRead },
  { to: '/workspace/record-access', label: 'Record Access', icon: FileClock, end: false, requires: PERMISSION.auditRead },
  { to: '/workspace/demo-requests', label: 'Sales Enquiries', icon: Inbox, end: false, requires: PERMISSION.leadsRead },
  { to: '/workspace/settings', label: 'Settings', icon: Settings, end: false },
]

/**
 * App shell for the authenticated SOC workspace.
 *
 * Deliberately its own chrome rather than the marketing `SiteHeader` /
 * `SiteFooter` — this is the product, not a page about the product, the way
 * a real security platform's console looks nothing like its own marketing
 * site. `App.tsx` swaps the chrome based on the route.
 */
export function WorkspaceShell() {
  const user = useAuthUser()
  const navigate = useNavigate()

  // Declared once for the whole console rather than on each page inside it.
  // Every route under /workspace requires a session, so a crawler reaching one
  // sees an empty shell — and the URLs themselves say where a customer's data
  // lives, which is not something to publish. robots.txt disallows the path;
  // this is what keeps it out of the index even when it is linked from
  // somewhere we do not control.
  useSeo({
    title: 'Console',
    description: 'The Difaac console.',
    path: '/workspace',
    noindex: true,
  })

  // A viewer and an administrator sign in at the same place and land on the
  // same platform; what differs is what it contains. Filtering here is a
  // convenience so nobody is shown a door that will not open — the API
  // enforces the same permissions on every request regardless.
  const visibleNav = navItems.filter(
    (item) => !item.requires || (user?.permissions?.includes(item.requires) ?? false),
  )

  async function handleSignOut() {
    await signOut()
    navigate('/sign-in')
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line-soft bg-ink-2 lg:flex">
        <div className="flex h-16 items-center border-b border-line-soft px-6">
          <LogoMark />
        </div>

        <nav aria-label="Workspace" className="flex flex-1 flex-col gap-1 p-4">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-body hover:bg-white/5 hover:text-text'
                }`
              }
            >
              <item.icon className="size-4.5 shrink-0" aria-hidden="true" strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line-soft p-4">
          <div className="mb-3 flex flex-col gap-0.5 px-1">
            <span className="truncate text-sm font-medium text-text">{user?.email}</span>
            <span className="text-xs uppercase tracking-wide text-muted-2">{user?.role}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-white/5 hover:text-error"
          >
            <LogOut className="size-4.5" aria-hidden="true" strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line-soft bg-ink-2/60 px-4 backdrop-blur-sm sm:px-6 lg:hidden">
          <LogoMark />
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-medium text-body hover:text-error"
          >
            Sign out
          </button>
        </header>

{/* Small-screen nav: same destinations, laid out as a scrollable strip rather than a collapsible drawer, so the workspace stays usable on a tablet without adding a second navigation pattern to build and maintain. */}
        <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto border-b border-line-soft bg-ink-2/60 px-4 py-2 lg:hidden">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-brand/10 text-brand' : 'text-body hover:text-text'
                }`
              }
            >
              <item.icon className="size-3.5" aria-hidden="true" strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
