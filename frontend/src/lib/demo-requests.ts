/**
 * Demo requests: the public submit call, and the authenticated read used by
 * the SOC workspace queue.
 *
 * Mirrors `backend/app/routes/demo_requests.py`. Submitting is deliberately
 * an unauthenticated `fetch` rather than `authFetch` — the sender is a
 * prospective customer with no account, and attaching a bearer token to a
 * public endpoint would be pointless at best.
 */

import useSWR from 'swr'
import { API_BASE_URL } from '@/lib/api'
import { authFetch } from '@/lib/auth'

export type DemoRequestInput = {
  product_slug: string
  name: string
  company: string
  email: string
  role: string
  context?: string
}

export type DemoRequest = {
  id: number
  product_slug: string
  name: string
  company: string
  email: string
  role: string
  context: string | null
  status: string
  created_at: string
}

export async function submitDemoRequest(input: DemoRequestInput): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    // 429 is the rate limiter, and is worth naming: it is the one failure a
    // legitimate sender can resolve themselves by waiting.
    if (response.status === 429) {
      throw new Error('Too many requests from this network. Please try again in a minute.')
    }
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || 'Your request could not be submitted. Please try again.')
  }
}

async function authFetcher<T>(path: string): Promise<T> {
  const res = await authFetch(path)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function useDemoRequests(limit = 100) {
  const { data, error, isLoading } = useSWR<DemoRequest[]>(
    `/api/demo-requests?limit=${limit}`,
    authFetcher,
    { refreshInterval: 60_000 },
  )
  return { requests: data ?? [], error, isLoading }
}
