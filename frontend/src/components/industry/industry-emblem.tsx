import type { LucideIcon } from 'lucide-react'
import { GlassEmblem } from '@/components/shared/glass-emblem'
import { INDUSTRY_ACCENT } from '@/lib/tone'

/**
 * Rendered emblem art, one per industry.
 *
 * The same glass-hexagon language as the product emblems, with the sector's
 * own subject inside it — a bank and a card for financial services, a mast
 * and a globe for telecom. Cut from one reference sheet and keyed from its
 * green background to transparent so each drops onto the page ground with no
 * visible edge.
 */
const INDUSTRY_EMBLEM_IMAGE: Record<string, string> = {
  'financial-services': '/industries/financial-services.png',
  government: '/industries/government.png',
  telecom: '/industries/telecom.png',
  'retail-ecommerce': '/industries/retail-ecommerce.png',
  crypto: '/industries/crypto.png',
  healthcare: '/industries/healthcare.png',
}

/** The emblem's image URL for a slug, for callers that need to place it
 *  themselves rather than render the standard component — the industry hero
 *  uses this to build its backdrop. */
export function getIndustryEmblem(slug: string): string | undefined {
  return INDUSTRY_EMBLEM_IMAGE[slug]
}

const EMBLEM_SIZE = {
  /** Mega-menu row, matching the product menu's emblem. */
  menu: 'size-10',
  /** Industry card on the listing and homepage. */
  card: 'size-14',
  /** Industry page hero. */
  hero: 'size-28 sm:size-32',
} as const

/**
 * The industry's emblem, or its Lucide icon in a bordered tile when no render
 * exists for that slug. The fallback keeps a newly added industry rendering
 * rather than leaving a hole, and looks deliberate on its own.
 */
export function IndustryEmblem({
  slug,
  icon: Icon,
  size = 'card',
  className,
}: {
  slug: string
  icon: LucideIcon
  size?: keyof typeof EMBLEM_SIZE
  className?: string
}) {
  const image = INDUSTRY_EMBLEM_IMAGE[slug]
  const sizeClass = EMBLEM_SIZE[size]

  if (!image) {
    return (
      <span
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-[4px] border border-line-soft bg-ink-2 text-brand ${className ?? ''}`}
      >
        <Icon className="size-1/2" aria-hidden="true" strokeWidth={1.6} />
      </span>
    )
  }

  return (
    <GlassEmblem
      src={image}
      tone={INDUSTRY_ACCENT}
      sizeClass={sizeClass}
      className={className}
      eager={size === 'hero'}
    />
  )
}
