/**
 * Authentication client.
 *
 * The access token is held in memory only. It is deliberately never written to
 * localStorage: a long-lived credential in storage is readable by any script on
 * the page, which is exactly what an XSS flaw gives an attacker. Session
 * continuity comes instead from the refresh cookie, which is HttpOnly and
 * therefore unreadable from JavaScript.
 *
 * A page reload clears the in-memory token, so `bootstrapSession` exchanges the
 * cookie for a fresh access token on startup.
 */

import { API_BASE_URL } from '@/lib/api'

export type AuthUser = {
  email: string
  full_name: string | null
  role: string
  created_at: string
}

type TokenPayload = {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}

let accessToken: string | null = null
let currentUser: AuthUser | null = null

// Whether the initial cookie-to-token exchange has settled, one way or the
// other. A protected route must wait for this before deciding whether to
// redirect to sign-in — otherwise every reload of a signed-in session would
// flash the sign-in page while `bootstrapSession` is still in flight.
let bootstrapped = false
const readyListeners = new Set<() => void>()

export function isBootstrapped(): boolean {
  return bootstrapped
}

export function subscribeReady(listener: () => void): () => void {
  readyListeners.add(listener)
  return () => readyListeners.delete(listener)
}

function markBootstrapped(): void {
  bootstrapped = true
  readyListeners.forEach((listener) => listener())
}

/**
 * The in-flight refresh, if one is running.
 *
 * This is load-bearing, not an optimisation. The server rotates the refresh
 * token on every use and treats a second presentation of an already-used token
 * as theft, revoking the whole token family. Two concurrent refreshes would
 * send the same cookie twice and lock the user out of their own session. All
 * callers therefore await the same promise.
 */
let refreshInFlight: Promise<boolean> | null = null

const listeners = new Set<(user: AuthUser | null) => void>()

function setSession(payload: TokenPayload | null): void {
  accessToken = payload?.access_token ?? null
  currentUser = payload?.user ?? null
  listeners.forEach((listener) => listener(currentUser))
}

export function subscribe(listener: (user: AuthUser | null) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getUser(): AuthUser | null {
  return currentUser
}

export function isSignedIn(): boolean {
  return accessToken !== null
}

/**
 * Exchange the refresh cookie for a new access token.
 *
 * Returns false when there is no usable session, which is the normal case for
 * a visitor who has never signed in — not an error worth surfacing.
 */
async function performRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      // Required for the browser to send the HttpOnly refresh cookie.
      credentials: 'include',
    })

    if (!response.ok) {
      setSession(null)
      return false
    }

    setSession((await response.json()) as TokenPayload)
    return true
  } catch {
    // Network failure, not an authentication failure. Clear the token so
    // callers retry cleanly rather than reusing one that may have expired.
    setSession(null)
    return false
  }
}

/** Refresh the session, collapsing concurrent callers onto one request. */
export function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

/** Restore a session on page load. Safe to call when signed out. */
export async function bootstrapSession(): Promise<boolean> {
  try {
    return await refreshSession()
  } finally {
    markBootstrapped()
  }
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Required for the browser to store the HttpOnly refresh cookie.
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // 429 covers both the per-IP rate limit and per-account lockout, and the
    // server sends Retry-After with the remaining time.
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After') ?? 0)
      const minutes = Math.ceil(retryAfter / 60)
      throw new Error(
        retryAfter > 0
          ? `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
          : 'Too many attempts. Please wait a moment and try again.',
      )
    }
    throw new Error(data.detail || 'Authentication failed')
  }

  setSession(data as TokenPayload)
  return (data as TokenPayload).user
}

/** Request a password reset link. Always resolves — the server never says whether the email exists. */
export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Could not process this request right now.')
  }
}

/** Complete a password reset with the token from the emailed link. */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'This reset link is invalid or has expired.')
  }
}

/** Change the password of the signed-in account. Ends the session — the server revokes every token. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await authFetch('/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Could not change the password.')
  }
  setSession(null)
}

export async function signOut(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Even if the request fails the local session must end, so the user is not
    // left appearing signed in with a token they can no longer use.
  }
  setSession(null)
}

/**
 * Fetch an authenticated endpoint, refreshing once if the token has expired.
 *
 * Access tokens are short-lived by design, so a 401 mid-session is expected
 * rather than exceptional. Exactly one retry is attempted: if the refreshed
 * token is also rejected, the session is genuinely over and retrying again
 * would loop.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...init.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

  let response = await send()

  if (response.status === 401) {
    const refreshed = await refreshSession()
    if (refreshed) {
      response = await send()
    }
  }

  return response
}
