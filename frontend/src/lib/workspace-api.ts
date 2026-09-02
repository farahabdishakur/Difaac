/**
 * Data hooks for the authenticated SOC workspace.
 *
 * Mirrors the shapes returned by `backend/app/routes/workspace.py` exactly —
 * columns are listed explicitly there and here, not spread with `...rest`, so
 * a column added on one side without the other fails visibly instead of
 * silently dropping data.
 *
 * Every request goes through `authFetch`, which attaches the bearer token and
 * retries once after a silent refresh on a 401. There is no static fallback
 * data here the way the public marketing hooks have one: this is a customer's
 * actual security posture, and showing placeholder incidents when the request
 * fails would be actively misleading.
 */

import useSWR from 'swr'
import { authFetch } from '@/lib/auth'

export type Ioc = {
  id: number
  value: string
  type: string
  severity: string
  source: string
  created_at: string
}

export type ThreatActor = {
  id: number
  name: string
  aliases: string | null
  origin: string | null
  description: string
}

export type PhishingDomain = {
  id: number
  domain: string
  status: string
  discovered_at: string
}

export type TiAlert = {
  id: number
  title: string
  category: string
  severity: string
  source: string
  actor: string | null
  is_tailored: number
  detected_at: string
}

export type TiSummary = {
  exposure_score: number
  severity_counts: Record<string, number>
  category_counts: { category: string; count: number }[]
  total_alerts: number
  tailored_alerts: number
  total_iocs: number
  total_actors: number
}

export type FraudCase = {
  id: number
  session_id: string
  risk_score: number
  status: string
  signal: string | null
  channel: string | null
  country: string | null
  detected_at: string
}

export type FraudSummary = {
  total_cases: number
  blocked: number
  high_risk: number
  average_risk: number
  by_signal: { signal: string; count: number }[]
  by_channel: { channel: string; count: number }[]
  by_status: { status: string; count: number }[]
}

export type Incident = {
  id: number
  title: string
  severity: string
  status: string
  reported_by: string | null
  created_at: string
}

async function authFetcher<T>(path: string): Promise<T> {
  const res = await authFetch(path)
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

const swrOptions = {
  // The workspace is read by an analyst watching for new activity, not a
  // page they load once — a short interval keeps it current without
  // hammering the API on every render.
  refreshInterval: 30_000,
  revalidateOnFocus: true,
}

export function useIocs(limit = 100) {
  const { data, error, isLoading } = useSWR<Ioc[]>(`/api/ti/iocs?limit=${limit}`, authFetcher, swrOptions)
  return { iocs: data ?? [], error, isLoading }
}

export function useThreatActors(limit = 100) {
  const { data, error, isLoading } = useSWR<ThreatActor[]>(`/api/ti/actors?limit=${limit}`, authFetcher, swrOptions)
  return { actors: data ?? [], error, isLoading }
}

export function useTiAlerts({ limit = 100, tailoredOnly = false } = {}) {
  const { data, error, isLoading } = useSWR<TiAlert[]>(
    `/api/ti/alerts?limit=${limit}&tailored_only=${tailoredOnly}`,
    authFetcher,
    swrOptions,
  )
  return { alerts: data ?? [], error, isLoading }
}

export function useTiSummary() {
  const { data, error, isLoading } = useSWR<TiSummary>('/api/ti/summary', authFetcher, swrOptions)
  return { summary: data, error, isLoading }
}

export function useFraudSummary() {
  const { data, error, isLoading } = useSWR<FraudSummary>('/api/fraud/summary', authFetcher, swrOptions)
  return { summary: data, error, isLoading }
}

export function usePhishingDomains(limit = 100) {
  const { data, error, isLoading } = useSWR<PhishingDomain[]>(`/api/drp/phishing?limit=${limit}`, authFetcher, swrOptions)
  return { domains: data ?? [], error, isLoading }
}

export function useFraudCases(limit = 100) {
  const { data, error, isLoading } = useSWR<FraudCase[]>(`/api/fraud/cases?limit=${limit}`, authFetcher, swrOptions)
  return { cases: data ?? [], error, isLoading }
}

export function useIncidents(limit = 100) {
  const { data, error, isLoading } = useSWR<Incident[]>(`/api/incidents?limit=${limit}`, authFetcher, swrOptions)
  return { incidents: data ?? [], error, isLoading }
}
