/**
 * Data hooks and actions for the account settings page — active sessions
 * and the actions that affect them. Mirrors `SessionResponse` in
 * `backend/app/models.py`.
 */

import useSWR from 'swr'
import { authFetch } from '@/lib/auth'

export type Session = {
  id: number
  issued_at: string
  expires_at: string
  ip_address: string | null
  user_agent: string | null
  current: boolean
}

async function authFetcher<T>(path: string): Promise<T> {
  const res = await authFetch(path)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function useSessions() {
  const { data, error, isLoading, mutate } = useSWR<Session[]>('/auth/sessions', authFetcher)
  return { sessions: data ?? [], error, isLoading, refresh: mutate }
}

export async function revokeSession(id: number): Promise<void> {
  const res = await authFetch(`/auth/sessions/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error('Could not revoke this session.')
  }
}
