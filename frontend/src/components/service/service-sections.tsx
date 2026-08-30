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
import { serviceGroupAccent, toneBadge, toneGlow } from '@/lib/tone'
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
  breadcrumbName,
  group,
}: {
  hero: ServicePageContent['hero']
  breadcrumbName: string
  group: Service['group']
}) {
  const Icon = getIcon(hero.badgeIcon)
  // Accent follows the engagement type (assessment / response / training /
  // investigation) — see `serviceGroupAccent` in `@/lib/tone`.
  const tone = serviceGroupAccent[group]

  return (
    <section className="-mt-14 pt-[calc(3.5rem+5rem)] lg:-mt-16 lg:pt-[calc(4rem+7rem)] relative overflow-hidden pb-24 lg:pb-32">
      <div
        className={`pointer-events-none absolute -top-24 right-[-10%] size-[32rem] rounded-full blur-3xl opacity-20 ${toneGlow[tone]}`}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex justify-center">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-2">
            <li>
              <a href="/" className="transition-colors hover:text-brand">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/services" className="transition-colors hover:text-brand">
                Services
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-body">{breadcrumbName}</li>
          </ol>
        </nav>

        <div className="text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm ${toneBadge[tone]}`}>
            <Icon className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">{hero.badge}</span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(38px,6.5vw,64px)] font-bold leading-[1.1] tracking-tight">
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

export function ServiceFacts({ facts }: { facts: ServicePageContent['facts'] }) {
  return (
    <div className="bg-ink-2">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line-soft px-4 sm:grid-cols-2 sm:divide-x-0 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-8">
        {facts.map((fact) => {
          const Icon = getIcon(fact.icon)
          return (
            <div key={fact.label} className="flex items-start gap-3 py-6 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-ink">
                <Icon className="size-4 text-brand" aria-hidden="true" />
              </div>
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
            <h2 className="font-display text-[clamp(24px,2.6vw,32px)] font-semibold leading-tight tracking-tight text-text">
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
          <h2 className="mt-6 font-display text-[clamp(28px,4vw,40px)] font-semibold leading-tight text-text">
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
}: {
  deliverables: ServicePageContent['deliverables']
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>Deliverables</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(28px,4vw,40px)] font-semibold leading-tight text-text">
            {deliverables.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{deliverables.description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-line-soft bg-gradient-to-br from-brand-ink/25 to-transparent p-6 transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand/15">
                  <Icon className="size-5 text-brand" aria-hidden="true" />
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

export function ServiceAudience({ audience }: { audience: ServicePageContent['audience'] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-[clamp(28px,4vw,40px)] font-semibold leading-tight text-text">
            {audience.heading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audience.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-line-soft bg-ink-2 p-8 transition-all duration-200 hover:border-brand/40"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-brand-ink">
                  <Icon className="size-6 text-brand" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>
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
          <h2 className="font-display text-[clamp(28px,4vw,40px)] font-semibold leading-tight text-text">
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
