import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { HeroBackdrop } from '@/components/product/product-emblem'
import type { Tone } from '@/lib/tone'

/**
 * The company pages, built on the grammar measured off group-ib.com's own
 * company section: one repeating unit — a small coloured eyebrow, a plain
 * centred headline with a single phrase set in the accent, and a grey
 * supporting line — stacked with generous air between repetitions.
 *
 * Two rules from that teardown are enforced here rather than left to each
 * page:
 *
 *   1. Emphasis is colour, never weight. The headings are weight 400; the
 *      operative phrase is set in brand green while the rest stays plain.
 *      Nothing on these pages is bold.
 *   2. Negative tracking scales with size, so a large headline reads as
 *      engineered rather than blown up.
 */

/**
 * A headline split into a plain lead, a phrase in the accent, and an optional
 * plain trail. Passing the three parts rather than a marked-up string keeps
 * the caller from having to hand in HTML, and keeps the accent phrase from
 * ever being an injection point.
 */
function TwoTone({ lead, accent, trail }: { lead?: string; accent: string; trail?: string }) {
  return (
    <>
      {lead ? <span>{lead} </span> : null}
      <span className="text-brand">{accent}</span>
      {trail ? <span> {trail}</span> : null}
    </>
  )
}

export type HeadingParts = { lead?: string; accent: string; trail?: string }

/**
 * The full-bleed page opener. Centred, over an atmospheric backdrop that runs
 * up behind the transparent header, the way every Group-IB company page opens.
 */
export function CompanyHero({
  eyebrow,
  heading,
  description,
  primary = { label: "Let's talk", href: '/talk-to-sales' },
  secondary,
  bgImage,
  tone = 'brand',
}: {
  eyebrow?: string
  heading: HeadingParts
  description: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  bgImage?: string
  tone?: Tone
}) {
  return (
    <section className="hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+5rem)] pb-20 lg:-mt-16 lg:pt-[calc(4rem+7rem)] lg:pb-28">
      <HeroBackdrop tone={tone} bgImage={bgImage} spread />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        {eyebrow ? (
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</span>
        ) : null}

        <h1 className="text-balance font-display text-[clamp(34px,6vw,64px)] font-normal leading-[1.08] tracking-[-0.03em] text-text">
          <TwoTone {...heading} />
        </h1>

        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-body">{description}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <LinkButton href={primary.href} size="lg">
            {primary.label}
            <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
          </LinkButton>
          {secondary ? (
            <LinkButton href={secondary.href} variant="secondary" size="lg">
              {secondary.label}
            </LinkButton>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The head of a repeating section: eyebrow, two-tone headline, optional line.
 * Centred by default, which is how the company pages run; a `left` alignment
 * is offered for the few blocks that pair a heading with a column beside it.
 */
export function SectionHead({
  eyebrow,
  heading,
  description,
  align = 'center',
}: {
  eyebrow: string
  heading: HeadingParts
  description?: string
  align?: 'center' | 'left'
}) {
  const centered = align === 'center'
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${centered ? 'mx-auto items-center text-center' : ''}`}>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</span>
      <h2 className="text-balance font-display text-[clamp(26px,4vw,44px)] font-normal leading-[1.14] tracking-[-0.02em] text-text">
        <TwoTone {...heading} />
      </h2>
      {description ? (
        <p className={`text-pretty leading-relaxed text-body ${centered ? 'max-w-xl' : ''}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

/**
 * A full-bleed section spacer. The unit's defining feature is the air around
 * it: the between-section gap is roughly double the within-section gap, so the
 * eye never has to guess where one idea ends. `wrap` centres the content
 * column at the same width the rest of the site uses.
 */
export function Band({
  children,
  muted = false,
  className = '',
}: {
  children: ReactNode
  muted?: boolean
  className?: string
}) {
  return (
    <section className={`py-20 lg:py-28 ${muted ? 'bg-ink-2' : ''} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
