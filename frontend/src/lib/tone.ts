/**
 * Shared accent-tone system.
 *
 * Difaac stays anchored to brand green everywhere (logo, primary actions,
 * headline emphasis), but a page that only ever shows green next to green
 * reads as one undifferentiated block. Group-ib.com solves this by tinting
 * each product page with its own hue while keeping the rest of the chrome
 * identical — this file is that same idea applied consistently across
 * products, solutions, services, and industries, so any component that needs
 * a tone reads from one place instead of re-declaring its own class maps.
 */

import type { Solution } from '@/lib/data/solutions'
import type { Service } from '@/lib/data/services'

export type Tone = 'brand' | 'cyan' | 'violet' | 'blue' | 'fuchsia' | 'rose'

/**
 * Per-product identity accent, used by the product hero (badge + background
 * glow) so each of the six products reads as its own page.
 *
 * Picked for fit rather than assigned in order: violet for intelligence work,
 * blue for the trust/finance territory fraud protection sits in, cyan for
 * scanning/discovery, fuchsia for a communications product, rose for
 * brand/identity risk. Managed XDR keeps the core brand green as the
 * flagship offering.
 */
export const productAccent: Record<string, Tone> = {
  'threat-intelligence': 'violet',
  'fraud-protection': 'blue',
  'managed-xdr': 'brand',
  'attack-surface-management': 'cyan',
  'digital-risk-protection': 'rose',
  'business-email-protection': 'fuchsia',
}

/**
 * Solutions are grouped rather than individually branded like products, so
 * the accent follows the group instead of the slug: tactical use-cases read
 * cooler/technical, role-based pages read more deliberate/strategic.
 */
export const solutionGroupAccent: Record<Solution['group'], Tone> = {
  'use-case': 'cyan',
  role: 'violet',
  industry: 'blue',
}

/** Services: the accent follows the engagement type. */
export const serviceGroupAccent: Record<Service['group'], Tone> = {
  assessment: 'cyan',
  response: 'rose',
  investigation: 'violet',
  training: 'fuchsia',
}

/**
 * Industries are audience verticals, not distinct offerings, so the section
 * shares one accent rather than fragmenting six unrelated hues the way
 * products do.
 */
export const INDUSTRY_ACCENT: Tone = 'blue'

/** Card/ring border classes per tone. */
export const toneRing: Record<Tone, string> = {
  brand: 'border-brand/50 hover:border-brand',
  cyan: 'border-accent-cyan/50 hover:border-accent-cyan',
  violet: 'border-accent-violet/50 hover:border-accent-violet',
  blue: 'border-accent-blue/50 hover:border-accent-blue',
  fuchsia: 'border-accent-fuchsia/50 hover:border-accent-fuchsia',
  rose: 'border-accent-rose/50 hover:border-accent-rose',
}

/** Icon chip background + foreground classes per tone. */
export const toneChip: Record<Tone, string> = {
  brand: 'bg-brand/20 text-brand',
  cyan: 'bg-accent-cyan/20 text-accent-cyan',
  violet: 'bg-accent-violet/20 text-accent-violet',
  blue: 'bg-accent-blue/20 text-accent-blue',
  fuchsia: 'bg-accent-fuchsia/20 text-accent-fuchsia',
  rose: 'bg-accent-rose/20 text-accent-rose',
}

/** Diagonal wash classes per tone, for card backgrounds. */
export const toneWash: Record<Tone, string> = {
  brand: 'from-brand-ink via-brand-ink/40 to-transparent',
  cyan: 'from-accent-cyan/10 via-accent-cyan/5 to-transparent',
  violet: 'from-accent-violet/10 via-accent-violet/5 to-transparent',
  blue: 'from-accent-blue/10 via-accent-blue/5 to-transparent',
  fuchsia: 'from-accent-fuchsia/10 via-accent-fuchsia/5 to-transparent',
  rose: 'from-accent-rose/10 via-accent-rose/5 to-transparent',
}

/** Hero badge pill classes per tone (border + background + text together). */
export const toneBadge: Record<Tone, string> = {
  brand: 'border-brand/40 bg-brand/10 text-brand',
  cyan: 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan',
  violet: 'border-accent-violet/40 bg-accent-violet/10 text-accent-violet',
  blue: 'border-accent-blue/40 bg-accent-blue/10 text-accent-blue',
  fuchsia: 'border-accent-fuchsia/40 bg-accent-fuchsia/10 text-accent-fuchsia',
  rose: 'border-accent-rose/40 bg-accent-rose/10 text-accent-rose',
}

/** Hero background glow classes per tone, for the soft radial wash behind the fold. */
export const toneGlow: Record<Tone, string> = {
  brand: 'bg-brand/20',
  cyan: 'bg-accent-cyan/20',
  violet: 'bg-accent-violet/20',
  blue: 'bg-accent-blue/20',
  fuchsia: 'bg-accent-fuchsia/20',
  rose: 'bg-accent-rose/20',
}

/** Bare text-colour class per tone, for an icon that sits on its own glass surface. */
export const toneText: Record<Tone, string> = {
  brand: 'text-brand',
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  blue: 'text-accent-blue',
  fuchsia: 'text-accent-fuchsia',
  rose: 'text-accent-rose',
}

/** Border-glow classes per tone for a glass surface, stronger than `toneRing`. */
export const toneBorderGlow: Record<Tone, string> = {
  brand: 'border-brand/30 shadow-[0_0_24px_-4px_var(--color-brand)]',
  cyan: 'border-accent-cyan/30 shadow-[0_0_24px_-4px_var(--color-accent-cyan)]',
  violet: 'border-accent-violet/30 shadow-[0_0_24px_-4px_var(--color-accent-violet)]',
  blue: 'border-accent-blue/30 shadow-[0_0_24px_-4px_var(--color-accent-blue)]',
  fuchsia: 'border-accent-fuchsia/30 shadow-[0_0_24px_-4px_var(--color-accent-fuchsia)]',
  rose: 'border-accent-rose/30 shadow-[0_0_24px_-4px_var(--color-accent-rose)]',
}
