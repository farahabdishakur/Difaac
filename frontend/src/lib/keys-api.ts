/**
 * Integration API keys, from the console.
 *
 * An administrator issues a key for their organisation, hands it to the
 * application that will report events, and revokes it if it leaks. The full
 * key is returned once by the create call and never again — the list only
 * shows prefixes.
 */
import useSWR from 'swr'
import { authFetch } from '@/lib/auth'

export type ApiKeySummary = {
  prefix: string
  name: string
  created_at: string
  last_used_at: string | null
  revoked_at: string | null
}

export type ApiKeyCreated = {
  key: string
  prefix: string
  name: string
}

async function keysFetcher(path: string): Promise<ApiKeySummary[]> {
  const res = await authFetch(path)
  if (!res.ok) throw new Error('Could not load API keys.')
  return res.json()
}

export function useApiKeys() {
  const { data, error, isLoading, mutate } = useSWR<ApiKeySummary[]>('/api/keys', keysFetcher)
  return { keys: data ?? [], error, isLoading, refresh: mutate }
}

export async function createApiKey(name: string): Promise<ApiKeyCreated> {
  const res = await authFetch('/api/keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Could not create the key.')
  }
  return res.json()
}

export async function revokeApiKey(prefix: string): Promise<void> {
  const res = await authFetch(`/api/keys/${encodeURIComponent(prefix)}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Could not revoke the key.')
  }
}
