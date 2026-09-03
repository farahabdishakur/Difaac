/**
 * Industry hero section — clean, secure, human design.
 *
 * Every industry page gets a dedicated full-bleed 3D visual background image
 * rendered in Difaac brand green (#00c979) and dark ink (#010005):
 * - Financial Services: 3D global banking network & holographic candlesticks
 * - Government: 3D national defense command center & radar sweeps
 * - Telecom: 3D 5G towers & fiber-optic network mesh
 * - Retail & eCommerce: 3D payment security card & biometric transaction rings
 * - Crypto: 3D perspective terrain grid & cryptographic asset lattice
 * - Healthcare: 3D multi-layer holographic clinical defense matrix
 *
 * Balanced, refined typography consistent across all industry pages.
 */

import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'

// ---------------------------------------------------------------------------
// Background images per industry slug.
// All 6 industries have dedicated premium 3D visual backgrounds.
// ---------------------------------------------------------------------------
const INDUSTRY_BG: Record<string, string> = {
  'financial-services': '/industries/bg-financial-services.jpg',
  government: '/industries/bg-government.jpg',
  telecom: '/industries/bg-telecom.jpg',
  'retail-ecommerce': '/industries/bg-retail-ecommerce.jpg',
  crypto: '/industries/bg-crypto.jpg',
  healthcare: '/industries/bg-healthcare.jpg',
}

interface IndustryHeroProps {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
  highlight: string
}

export function IndustryHeroEnhanced({
  slug,
  name,
  tagline,
  description,
  highlight,
}: IndustryHeroProps) {
  const bgImage = INDUSTRY_BG[slug]

  return (
    <section className="relative min-h-[75vh] overflow-hidden bg-ink">
      {/* ── Full-bleed 3D visual background with layered contrast scrims ── */}
      {bgImage ? (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={bgImage}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          {/* Vertical gradient for contrast & seamless page ground blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/60 to-ink" />
          {/* Subtle side vignettes for reading focus */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-ink/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* ── Content (Refined, balanced typography) ──────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-[75vh] max-w-4xl flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center">
          {/* Heading — balanced and refined, not overly large */}
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(28px,4vw,46px)] font-bold leading-[1.18] tracking-tight text-text">
            {highlight}
          </h1>

          {/* Description — clear and readable */}
          <p className="mx-auto mt-5 max-w-2xl text-[clamp(15px,1.4vw,18px)] leading-relaxed text-body/90">
            {description}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href="/talk-to-sales" size="lg" className="gap-2 px-7">
              Get Protected
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/resources" variant="secondary" size="lg" className="px-7">
              View Case Studies
            </LinkButton>
          </div>

          {/* Tagline Divider */}
          <div className="mx-auto mt-12 max-w-md border-t border-line-soft/40 pt-5">
            <p className="text-sm font-medium tracking-wide text-muted-2">
              {tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade to page ground */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-ink" />
    </section>
  )
}
