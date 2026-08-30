import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser, useSessionReady } from '@/hooks/use-auth'

/**
 * Gates SOC workspace routes behind an authenticated session.
 *
 * Waits for `useSessionReady` before deciding: the access token lives in
 * memory only (see `@/lib/auth`), so on a fresh page load it is briefly
 * unknown whether the visitor has a valid refresh cookie. Redirecting before
 * that check settles would bounce a signed-in analyst on every reload.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthUser()
  const ready = useSessionReady()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="size-8 animate-spin rounded-full border-2 border-line border-t-brand" aria-label="Loading" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
