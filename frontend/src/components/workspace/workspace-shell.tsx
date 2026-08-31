import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Radar, Fingerprint, ShieldAlert, Siren, Settings, LogOut } from 'lucide-react'
import { LogoMark } from '@/components/layout/logo-mark'
import { useAuthUser } from '@/hooks/use-auth'
import { signOut } from '@/lib/auth'

const navItems = [
  { to: '/workspace', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/workspace/threat-intelligence', label: 'Threat Intelligence', icon: Radar, end: false },
  { to: '/workspace/digital-risk', label: 'Digital Risk Protection', icon: Fingerprint, end: false },
  { to: '/workspace/fraud', label: 'Fraud Cases', icon: ShieldAlert, end: false },
  { to: '/workspace/incidents', label: 'Incidents', icon: Siren, end: false },
  { to: '/workspace/settings', label: 'Settings', icon: Settings, end: false },
] as const

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
          {navItems.map((item) => (
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

        {/* Small-screen nav: same destinations, laid out as a scrollable strip
            rather than a collapsible drawer, so the workspace stays usable on
            a tablet without adding a second navigation pattern to build and
            maintain. */}
        <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto border-b border-line-soft bg-ink-2/60 px-4 py-2 lg:hidden">
          {navItems.map((item) => (
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
