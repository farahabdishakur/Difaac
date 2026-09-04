/**
 * Shared section components for the service pages.
 *
 * Services are engagements, so these sections lead with scope, a phased
 * methodology, and concrete deliverables rather than the comparison tables and
 * capability tabs used on product pages. Content lives in
 * `@/lib/data/service-pages`.
 */

import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { GlassIcon } from '@/components/product/product-sections'
import { HeroBackdrop } from '@/components/product/product-emblem'
import { serviceGroupAccent, toneText } from '@/lib/tone'
import type { ServicePageContent } from '@/lib/data/service-pages'
import type { Service } from '@/lib/data/services'

/**
 * Section label.
 *
 * Uses the warm accent rather than the brand green. It is the only warm mark on
 * the page, so it catches the eye at the top of each section and gives a reader
 * scanning the page a rhythm to follow — while the green stays reserved for
 * actions and figures, which is what should be clicked and remembered.
 */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-line bg-amber-soft px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-amber">
      <span className="inline-block size-1.5 rounded-full bg-amber" aria-hidden="true" />
      {children}
    </span>
  )
}

export function ServiceHero({
  hero,
  group,
}: {
  hero: ServicePageContent['hero']
  group: Service['group']
}) {
  const Icon = getIcon(hero.badgeIcon)
  // Accent follows the engagement type (assessment / response / training /
  // investigation) — see `serviceGroupAccent` in `@/lib/tone`.
  const tone = serviceGroupAccent[group]

  return (
    <section className="-mt-14 pt-[calc(3.5rem+5rem)] lg:-mt-16 lg:pt-[calc(4rem+7rem)] relative overflow-hidden pb-24 lg:pb-32">
      {/* The same wash the product heroes use: the accent carries up behind
          the transparent header and settles into the page ground, so the
          section has no top edge. */}
      <HeroBackdrop tone={tone} spread />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* No name pill above the headline: the nav already names where you
            are, so a badge repeating the service only pushes the headline down
            the page. */}
        <div className="text-center">
          <h1 className="font-display t-h1 font-semibold leading-[1.15]">
            <span className="text-text">{hero.headlineLead}</span>
            <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-ultra bg-clip-text text-transparent">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body">{hero.description}</p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton href="/talk-to-sales" size="lg">
              Let&apos;s Talk
              <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#methodology" variant="secondary" size="lg">
              See methodology
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ServiceFacts({ facts, group }: { facts: ServicePageContent['facts']; group: Service['group'] }) {
  const tone = serviceGroupAccent[group]

  return (
    <div className="bg-ink-2">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line-soft px-4 sm:grid-cols-2 sm:divide-x-0 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-8">
        {facts.map((fact) => {
          const Icon = getIcon(fact.icon)
          return (
            <div key={fact.label} className="flex items-start gap-3 py-6 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <GlassIcon icon={Icon} tone={tone} size="sm" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wider text-muted-2">{fact.label}</span>
                <span className="font-display text-base font-semibold text-text">{fact.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ServiceOverview({ overview }: { overview: ServicePageContent['overview'] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display t-h3 font-semibold text-text">
              {overview.title}
            </h2>
            <p className="text-sm leading-relaxed text-body">{overview.body}</p>
            <div className="border-t border-line-soft pt-6">
              <LinkButton href="/talk-to-sales">
                Request a consultation
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
              What is covered
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {overview.scope.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2.5 border border-line-soft bg-ink-2 p-4 transition-colors duration-200 hover:border-brand/40"
                >
                  <h4 className="text-sm font-semibold text-text">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-body">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Phased methodology, rendered as a numbered timeline. */
export function ServicePhases({ phases }: { phases: ServicePageContent['phases'] }) {
  return (
    <section id="methodology" className="scroll-mt-24 bg-ink-2/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>Methodology</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {phases.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{phases.description}</p>
        </div>

        <ol className="relative flex flex-col gap-px">
          {phases.items.map((phase, index) => (
            <li
              key={phase.title}
              className="group grid grid-cols-[auto_1fr] gap-5 border-l-2 border-line-soft bg-ink-2 p-6 transition-colors duration-200 hover:border-l-brand sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-8 lg:p-8"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand-ink font-display text-sm font-semibold text-brand">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-semibold text-text">{phase.title}</h3>
                <p className="text-sm leading-relaxed text-body">{phase.description}</p>
              </div>

              <span className="col-start-2 w-fit rounded-full border border-line-soft bg-ink px-3 py-1 text-xs font-medium text-muted-2 sm:col-start-3 sm:whitespace-nowrap">
                {phase.duration}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ServiceDeliverables({
  deliverables,
  group,
}: {
  deliverables: ServicePageContent['deliverables']
  group: Service['group']
}) {
  const tone = serviceGroupAccent[group]

  return (
    // The deliverables are numbered rather than shown as an unordered grid:
    // this is the list of what physically arrives at the end of the
    // engagement, and a buyer reads it as a sequence, not a feature set.
    <section className="border-t border-line-soft bg-ink-2 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>Deliverables</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {deliverables.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{deliverables.description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.items.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-line bg-ink/60 p-6 transition-colors duration-200 hover:border-brand/40"
              >
                <div className="flex items-center justify-between">
                  <GlassIcon icon={Icon} tone={tone} size="sm" />
                  <span className="font-mono text-xs text-muted-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ServiceAudience({ audience, group }: { audience: ServicePageContent['audience']; group: Service['group'] }) {
  const tone = serviceGroupAccent[group]

  return (
    // Split by who receives what. An engagement produces different things for
    // the security team, for management, and for the person accountable for
    // the budget, and naming the recipient is what makes the section useful
    // rather than three more benefit cards.
    <section className="border-t border-line-soft py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>Who it is for</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {audience.heading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audience.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-line bg-ink-2/60 p-8 transition-colors duration-200 hover:border-brand/40"
              >
                <GlassIcon icon={Icon} tone={tone} />
                <h3 className={`font-display text-lg font-semibold ${toneText[tone]}`}>{item.title}</h3>
                <p className="text-sm leading-relaxed text-body">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ServiceFAQ({ faqs }: { faqs: ServicePageContent['faqs'] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display t-h3 font-semibold text-text">
            Frequently asked questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="rounded-lg border border-line-soft bg-ink-2/40">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`service-faq-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-ink-2/80"
                  >
                    <span className="font-medium text-text">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-muted-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                {isOpen ? (
                  <div id={`service-faq-${index}`} className="border-t border-line-soft px-6 py-4">
                    <p className="text-sm leading-relaxed text-body">{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
