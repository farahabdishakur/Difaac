import { useSyncExternalStore } from 'react'
import { subscribe, getUser, subscribeReady, isBootstrapped, type AuthUser } from '@/lib/auth'

/** The signed-in user, or null. Re-renders on sign-in, sign-out, and refresh. */
export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(subscribe, getUser, getUser)
}

/**
 * Whether the initial cookie-to-token exchange has settled. A protected
 * route should render a loading state rather than redirect while this is
 * false, or a signed-in visitor reloading the page would be bounced to
 * sign-in before their session has had a chance to restore.
 */
export function useSessionReady(): boolean {
  return useSyncExternalStore(subscribeReady, isBootstrapped, isBootstrapped)
}
