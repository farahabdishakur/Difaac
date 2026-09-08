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
      <div className="flex aspect-square w-24 items-center justify-center rounded-lg border border-line bg-ink-3">
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
      className="aspect-square w-24 rounded-lg border border-line object-cover"
      loading="lazy"
    />
  )
}

function Card({ person }: { person: Founder }) {
  return (
    <figure className="flex h-full flex-col items-center gap-3 rounded-xl border border-line bg-ink-2/70 px-5 py-6 text-center transition-colors hover:border-line-soft">
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

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-center lg:gap-6">
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
          <Row>
            {tier.map((person) => (
              <div key={person.name} className="lg:max-w-xs lg:flex-1">
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
    return <div aria-hidden="true" className="mx-auto hidden h-14 w-px bg-line lg:block" />
  }

  return (
    <div aria-hidden="true" className="hidden lg:block">
      <div className="mx-auto h-7 w-px bg-line" />
      <div className="flex">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="flex h-px w-full">
              <div className={i === 0 ? 'w-1/2' : 'w-1/2 bg-line'} />
              <div className={i === columns - 1 ? 'w-1/2' : 'w-1/2 bg-line'} />
            </div>
            <div className="h-7 w-px bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}
