/**
 * Product emblem and hero backdrop.
 *
 * group-ib.com gives every product page two pieces of art: a full-bleed
 * background photograph behind the hero, and a rendered 3D emblem centred
 * above the headline. Both are shipped as image files there.
 *
 * Here they are drawn instead — inline SVG and CSS gradients. That is not a
 * shortcut: a drawn emblem inherits the product's accent token, so changing
 * a brand colour updates every product page at once; it stays sharp at any
 * density; and it adds no image request, which matters because the hero is
 * the first paint on the page. It also means the pages carry no external
 * asset URLs at all.
 */

import type { LucideIcon } from 'lucide-react'
import type { Tone } from '@/lib/tone'
import { toneText } from '@/lib/tone'

/** Accent colour per tone as a raw CSS custom property, for SVG `stroke`/`fill`. */
const toneVar: Record<Tone, string> = {
  brand: 'var(--color-brand)',
  cyan: 'var(--color-accent-cyan)',
  violet: 'var(--color-accent-violet)',
  blue: 'var(--color-accent-blue)',
  fuchsia: 'var(--color-accent-fuchsia)',
  rose: 'var(--color-accent-rose)',
}

/**
 * The product's emblem: an isometric prism holding the product's own glyph.
 *
 * One shape shared by all six products rather than six bespoke drawings —
 * the prism is the constant that says "Difaac product", and the glyph and
 * accent inside it are what say *which* product. Six unrelated drawings
 * would read as six different companies.
 */
export function ProductEmblem({
  icon: Icon,
  tone = 'brand',
  className,
}: {
  icon: LucideIcon
  tone?: Tone
  className?: string
}) {
  const accent = toneVar[tone]
  // Scoped per tone so two emblems on one page cannot collide on gradient ids.
  const uid = `emblem-${tone}`

  return (
    <span className={`relative inline-flex size-28 items-center justify-center sm:size-32 ${className ?? ''}`}>
      {/* Ambient glow, sized past the prism so the light appears to come from
          the object rather than sitting behind it as a disc. */}
      <span
        className="pointer-events-none absolute inset-0 scale-150 rounded-full opacity-40 blur-2xl"
        style={{ background: accent }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 120 120"
        className="relative size-full"
        role="presentation"
        aria-hidden="true"
      >
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

        {/* Inner facets: the three edges meeting at the centre are what make
            the flat hexagon read as a solid rather than an outline. */}
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
        className={`absolute size-9 sm:size-10 ${toneText[tone]}`}
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </span>
  )
}

/**
 * Full-bleed hero backdrop.
 *
 * Three transparent layers in place of group-ib.com's background photograph:
 * two wide accent washes that give the hero depth, and a fine grid that
 * reads as texture at close range and disappears at a normal viewing
 * distance. Everything is transparent over the page ground, so the section
 * below meets it without a seam.
 */
export function HeroBackdrop({ tone = 'brand' }: { tone?: Tone }) {
  const accent = toneVar[tone]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 15% -10%, color-mix(in srgb, ${accent} 22%, transparent) 0%, transparent 60%),
             radial-gradient(90% 70% at 95% 5%, color-mix(in srgb, ${accent} 14%, transparent) 0%, transparent 65%)`,
        }}
      />

      {/* Grid, masked so it fades out before the fold instead of stopping on
          a hard line. */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${accent} 1px, transparent 1px),
             linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 75%)',
        }}
      />

      {/* Settles the wash back to the page ground at the fold. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}
