import useSWR from 'swr'
import { products as staticProducts, type Product } from '@/lib/data/products'
import { industries as staticIndustries, type Industry } from '@/lib/data/industries'
import { solutions as staticSolutions, type Solution } from '@/lib/data/solutions'
import { services as staticServices, type Service } from '@/lib/data/services'

// Empty by default, so every call is relative and lands on whatever origin
// served the page: Vite's proxy in development, Caddy in production. Set
// VITE_API_URL only to point a build at an API on a different host — and know
// that doing so makes the refresh cookie cross-origin.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`)
  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`)
    throw error
  }
  return res.json() as Promise<T>
}

export function useProducts() {
  const { data, isLoading } = useSWR<Product[]>('/products', fetcher, {
    fallbackData: staticProducts,
    shouldRetryOnError: false,
  })
  const resolved = data ?? staticProducts
  return { products: resolved, error: null, isLoading: isLoading && !resolved }
}

export function useProduct(slug: string | undefined) {
  const fallback = slug ? staticProducts.find((p) => p.slug === slug) : undefined
  const { data, error, isLoading } = useSWR<Product>(
    slug ? `/products/${slug}` : null,
    fetcher,
    {
      fallbackData: fallback,
      shouldRetryOnError: false,
    },
  )
  const resolved = data ?? fallback
  return { product: resolved, error: resolved ? null : error, isLoading: isLoading && !resolved }
}

export function useIndustries() {
  const { data, isLoading } = useSWR<Industry[]>('/industries', fetcher, {
    fallbackData: staticIndustries,
    shouldRetryOnError: false,
  })
  const resolved = data ?? staticIndustries
  return { industries: resolved, error: null, isLoading: isLoading && !resolved }
}

export function useIndustry(slug: string | undefined) {
  const fallback = slug ? staticIndustries.find((i) => i.slug === slug) : undefined
  const { data, error, isLoading } = useSWR<Industry>(
    slug ? `/industries/${slug}` : null,
    fetcher,
    {
      fallbackData: fallback,
      shouldRetryOnError: false,
    },
  )
  const resolved = data ?? fallback
  return { industry: resolved, error: resolved ? null : error, isLoading: isLoading && !resolved }
}

export function useSolutions() {
  const { data, isLoading } = useSWR<Solution[]>('/solutions', fetcher, {
    fallbackData: staticSolutions,
    shouldRetryOnError: false,
  })
  const resolved = data ?? staticSolutions
  return { solutions: resolved, error: null, isLoading: isLoading && !resolved }
}

export function useSolution(slug: string | undefined) {
  const fallback = slug ? staticSolutions.find((s) => s.slug === slug) : undefined
  const { data, error, isLoading } = useSWR<Solution>(
    slug ? `/solutions/${slug}` : null,
    fetcher,
    {
      fallbackData: fallback,
      shouldRetryOnError: false,
    },
  )
  const resolved = data ?? fallback
  return { solution: resolved, error: resolved ? null : error, isLoading: isLoading && !resolved }
}

export function useServices() {
  const { data, isLoading } = useSWR<Service[]>('/services', fetcher, {
    fallbackData: staticServices,
    shouldRetryOnError: false,
  })
  const resolved = data ?? staticServices
  return { services: resolved, error: null, isLoading: isLoading && !resolved }
}

export function useService(slug: string | undefined) {
  const fallback = slug ? staticServices.find((s) => s.slug === slug) : undefined
  const { data, error, isLoading } = useSWR<Service>(
    slug ? `/services/${slug}` : null,
    fetcher,
    {
      fallbackData: fallback,
      shouldRetryOnError: false,
    },
  )
  const resolved = data ?? fallback
  return { service: resolved, error: resolved ? null : error, isLoading: isLoading && !resolved }
}

