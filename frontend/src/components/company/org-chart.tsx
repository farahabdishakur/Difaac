import { useState } from 'react'
import type { Founder } from '@/lib/data/company'

/**
 * The leadership as a reporting structure rather than a flat grid.
 *
 * Each tier is a row, and the connectors joining one tier to the next are
 * drawn by the same flex layout that positions the cards — a stem below the
 * tier above, a rule across the row, and a stub down to each card. Sharing the
 * layout is what keeps the lines meeting the cards at every width instead of
 * drifting off them.
 *
 * Below `lg` the connectors are hidden and the tiers stack. A tree drawn on a
 * 390px screen is a column of cards joined by lines that no longer describe
 * anything; the order carries the hierarchy there instead.
 */

function Portrait({ person }: { person: Founder }) {
  const [broken, setBroken] = useState(false)

  if (!person.photo || broken) {
    return (
      <div className="flex aspect-square w-24 items-center justify-center rounded-lg border border-brand/30 bg-ink-3">
        <span className="font-display text-2xl text-brand/60" aria-hidden="true">
          {person.name[0]}
        </span>
      </div>
    )
  }

  return (
    <img
      src={person.photo}
      alt={`${person.name} — Difaac`}
      onError={() => setBroken(true)}
      width={400}
      height={400}
      style={{ objectPosition: person.objectPosition ?? 'center 12%' }}
      className="aspect-square w-24 rounded-lg border border-brand/30 object-cover"
      loading="lazy"
    />
  )
}

function Card({ person }: { person: Founder }) {
  return (
    <figure className="flex h-full flex-col items-center gap-3 rounded-xl border border-brand/30 bg-ink-2/70 px-5 py-6 text-center transition-colors hover:border-brand/70 hover:bg-brand/10">
      <Portrait person={person} />
      <figcaption className="flex flex-col gap-1">
        <span className="font-display text-base font-medium text-text">{person.name}</span>
        <span className="text-sm leading-snug text-body">{person.role}</span>
        {person.department ? (
          <span className="text-xs uppercase tracking-[0.14em] text-muted-2">
            {person.department}
          </span>
        ) : null}
        {person.note ? (
          <span className="mt-2 text-xs leading-relaxed text-muted-2">{person.note}</span>
        ) : null}
      </figcaption>
    </figure>
  )
}

// A card is 288px wide with 24px between cards, which is what decides how wide
// a row of n of them is. The connector above the row divides that same width,
// so a stub is always over a card centre however many cards the row holds.
const CARD_WIDTH = 288
const CARD_GAP = 24

function rowWidth(columns: number): string {
  return `${columns * CARD_WIDTH + (columns - 1) * CARD_GAP}px`
}

function Row({ columns, children }: { columns: number; children: React.ReactNode }) {
  return (
    <div
      className="org-row mx-auto flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6"
      style={{ ['--org-row-width' as string]: rowWidth(columns) }}
    >
      {children}
    </div>
  )
}

export function OrgChart({ tiers }: { tiers: Founder[][] }) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      {tiers.map((tier, index) => (
        <div key={tier.map((p) => p.name).join()}>
          {index > 0 ? <Bridge columns={tier.length} /> : null}
          <Row columns={tier.length}>
            {tier.map((person) => (
              <div key={person.name} className="lg:flex-1">
                <Card person={person} />
              </div>
            ))}
          </Row>
        </div>
      ))}
    </div>
  )
}

/**
 * A stem, a horizontal rule inset to the first and last card centres, and a
 * stub down to each. The rule is inset by half a column so it starts and ends
 * over a card rather than in the gutter beside it.
 */
function Bridge({ columns }: { columns: number }) {
  if (columns === 1) {
    return <div aria-hidden="true" className="mx-auto hidden h-14 w-px bg-brand/50 lg:block" />
  }

  return (
    <div
      aria-hidden="true"
      className="org-row mx-auto hidden lg:block"
      style={{ ['--org-row-width' as string]: rowWidth(columns) }}
    >
      <div className="mx-auto h-7 w-px bg-brand/50" />
      {/* Inset by half a card, so the rule begins and ends directly over the
          outermost stubs rather than running past them into the margin. */}
      <div className="border-t border-brand/50" style={{ marginInline: `${CARD_WIDTH / 2}px` }} />
      {/* The same gap the row uses: without it each stub sits half a gap off
          the card it belongs to, which reads as a drawing mistake. */}
      <div className="flex gap-6">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <div className="h-7 w-px bg-brand/50" />
          </div>
        ))}
      </div>
    </div>
  )
}

