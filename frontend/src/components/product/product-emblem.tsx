/**
 * Product emblem and hero backdrop.
 *
 * group-ib.com gives every product page two pieces of art: a full-bleed
 * background behind the hero, and a rendered 3D emblem centred above the
 * headline. Difaac does the same, with its own renders.
 *
 * Each product ships a real render — a glass hexagon holding the product's
 * glyph, standing on a glowing ring — keyed from its black background to
 * transparent so it drops onto the page ground with no visible edge. The
 * drawn SVG below is the fallback for a product that has no render yet: a
 * new product still gets a considered mark instead of a hole.
 */

import type { LucideIcon } from 'lucide-react'
import { GlassEmblem } from '@/components/shared/glass-emblem'
import { toneText, toneVar } from '@/lib/tone'
import type { Tone } from '@/lib/tone'

/** The rendered emblem for each product, by slug. */
const PRODUCT_EMBLEM_IMAGE: Record<string, string> = {
  'threat-intelligence': '/emblems/emblem_threat-intelligence.webp',
  'fraud-protection': '/emblems/emblem_fraud-protection.webp',
  'managed-xdr': '/emblems/emblem_managed-xdr.webp',
  'attack-surface-management': '/emblems/emblem_attack-surface-management.webp',
  'digital-risk-protection': '/emblems/emblem_digital-risk-protection.webp',
  'business-email-protection': '/emblems/emblem_business-email-protection.webp',
}

const EMBLEM_SIZE = {
  /** Product switcher tabs: the whole catalogue has to fit on one row. */
  tab: 'size-7',
  /** Mega-menu row: big enough that the render still reads as glass, not a smudge. */
  menu: 'size-10',
  /** Product card and selection rows. */
  card: 'size-14',
  /** Product hero. Sized up from the card treatment because the emblem shares
      the accent of the wash behind it — at a smaller size it stops reading as
      an object and starts disappearing into its own backdrop. */
  hero: 'size-32 sm:size-40',
} as const

/**
 * The product's emblem.
 *
 * Renders the product's own artwork when it has one, and otherwise an
 * isometric prism holding the product's glyph — one shape shared by every
 * product, because the prism is the constant that says "Difaac product" while
 * the glyph and accent say *which* product.
 */
export function ProductEmblem({
  icon: Icon,
  tone = 'brand',
  slug,
  size = 'hero',
  className,
}: {
  icon: LucideIcon
  tone?: Tone
  slug?: string
  size?: keyof typeof EMBLEM_SIZE
  className?: string
}) {
  const accent = toneVar[tone]
  // Scoped per tone so two emblems on one page cannot collide on gradient ids.
  const uid = `emblem-${tone}`
  const sizeClass = EMBLEM_SIZE[size]
  const image = slug ? PRODUCT_EMBLEM_IMAGE[slug] : undefined

  if (image) {
    return (
      <GlassEmblem
        src={image}
        tone={tone}
        sizeClass={sizeClass}
        className={className}
        eager={size === 'hero'}
      />
    )
  }

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${sizeClass} ${className ?? ''}`}
    >
{/* Ambient glow, sized past the prism so the light appears to come from the object rather than sitting behind it as a disc. */}
      <span
        className="pointer-events-none absolute inset-0 scale-150 rounded-full opacity-40 blur-2xl"
        style={{ background: accent }}
        aria-hidden="true"
      />

      <svg viewBox="0 0 120 120" className="relative size-full" role="presentation" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.30" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`${uid}-edge`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.25" />
          </linearGradient>
        </defs>

{/* Outer prism: a hexagon read as a cube seen corner-on. */}
        <polygon
          points="60,8 108,34 108,86 60,112 12,86 12,34"
          fill={`url(#${uid}-face)`}
          stroke={`url(#${uid}-edge)`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

{/* Inner facets: the three edges meeting at the centre are what make the flat hexagon read as a solid rather than an outline. */}
        <g stroke={accent} strokeOpacity="0.28" strokeWidth="1">
          <line x1="60" y1="8" x2="60" y2="60" />
          <line x1="108" y1="34" x2="60" y2="60" />
          <line x1="12" y1="34" x2="60" y2="60" />
        </g>

{/* Inner prism, offset inward to suggest depth through the glass. */}
        <polygon
          points="60,30 87,45 87,75 60,90 33,75 33,45"
          fill={accent}
          fillOpacity="0.06"
          stroke={accent}
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

{/* The product's own glyph, centred in the prism. */}
      <Icon
        className={`absolute size-1/3 ${toneText[tone]}`}
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </span>
  )
}

/** The product hero background artwork, by slug. */
export const PRODUCT_BACKGROUND_IMAGE: Record<string, string> = {
  'threat-intelligence': '/products/hero-threat-intelligence.jpg',
  'managed-xdr': '/products/hero-managed-xdr.jpg',
  'fraud-protection': '/products/hero-fraud-protection.jpg',
  'digital-risk-protection': '/products/hero-digital-risk-protection.jpg',
  'attack-surface-management': '/products/hero-attack-surface-management.jpg',
  'business-email-protection': '/products/hero-business-email-protection.jpg',
}

/**
 * Full-bleed hero backdrop.
 *
 * Combines high-resolution, thematic cyber defense imagery with tailored
 * transparent gradients and radial vignetting over the page ground.
 * Blends smoothly to ink at the fold and below the header with zero seams.
 */
export function HeroBackdrop({
  tone = 'brand',
  spread,
  slug,
  bgImage,
}: {
  tone?: Tone;
  spread?: boolean;
  slug?: string;
  bgImage?: string;
}) {
  const accent = toneVar[tone]
  const image = bgImage ?? (slug ? PRODUCT_BACKGROUND_IMAGE[slug] : undefined)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {image ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt=""
            className="size-full object-cover object-center opacity-60 mix-blend-screen scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-transparent to-ink/90" />
          {/* Subtle radial mask so central text and emblem pop with maximum contrast */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 38%, rgba(1,0,5,0.20) 0%, rgba(1,0,5,0.65) 55%, rgba(1,0,5,0.98) 100%)'
            }}
          />
        </div>
      ) : null}

      <div
        className="absolute inset-0 opacity-[0.40]"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 15% -10%, color-mix(in srgb, ${accent} 24%, transparent) 0%, transparent 60%),
             radial-gradient(90% 70% at 95% 5%, color-mix(in srgb, ${accent} 16%, transparent) 0%, transparent 65%)`,
        }}
      />

      {/* The product hero opts into a single wide pool of the accent, centred high enough that the colour carries up behind the transparent header and reaches the top of the page rather than starting below it. */}
      {spread ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(78% 62% at 50% 16%, color-mix(in srgb, ${accent} 38%, transparent) 0%, color-mix(in srgb, ${accent} 14%, transparent) 42%, transparent 76%)`,
          }}
        />
      ) : null}

      {/* Settles the wash back to the page ground at the fold. */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-ink/80 to-ink" />
    </div>
  )
}

