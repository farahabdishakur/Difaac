/**
 * Shared section components for the product marketing pages.
 *
 * Each one renders a slice of `ProductPageContent`, so all six products share a
 * single implementation and stay visually consistent. Content lives in
 * `@/lib/data/product-pages`.
 */

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check, X, ChevronDown, Sparkles } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem, HeroBackdrop } from '@/components/product/product-emblem'
import { BrowserFrame } from '@/components/shared/browser-frame'
import {
  productAccent,
  toneRing,
  toneChip,
  toneWash,
  toneBadge,
  toneGlow,
  toneText,
  toneBorderGlow,
} from '@/lib/tone'
import type { Tone } from '@/lib/tone'
import type { ProductPageContent } from '@/lib/data/product-pages'

/**
 * A glass-surfaced icon badge: a blurred tone-coloured glow behind a
 * translucent, backdrop-blurred panel. This is the visual language a page
 * like group-ib.com/products/fraud-protection reaches for — an icon that
 * reads as an object catching light, not a flat coloured square — built
 * from CSS rather than a rendered asset, so it costs nothing to reuse
 * everywhere a section wants a focal icon.
 */
export function GlassIcon({
  icon: Icon,
  tone = 'brand',
  size = 'md',
}: {
  icon: LucideIcon
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}) {
  const boxSize = { sm: 'size-11', md: 'size-13', lg: 'size-16' }[size]
  const iconSize = { sm: 'size-5', md: 'size-6', lg: 'size-7' }[size]

  return (
    <span className={`relative inline-flex ${boxSize} shrink-0 items-center justify-center`}>
      <span
        className={`absolute inset-0 rounded-2xl ${toneGlow[tone]} opacity-50 blur-lg`}
        aria-hidden="true"
      />
      <span
        className={`relative flex size-full items-center justify-center rounded-2xl border bg-white/[0.03] backdrop-blur-md ${toneBorderGlow[tone]}`}
      >
        <Icon className={`${iconSize} ${toneText[tone]}`} aria-hidden="true" strokeWidth={1.5} />
      </span>
    </span>
  )
}

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

export function ProductHero({
  hero,
  slug,
}: {
  hero: ProductPageContent['hero']
  slug: string
}) {
  const Icon = getIcon(hero.badgeIcon)
  // Each product gets its own accent so its hero reads as its own page, the
  // way group-ib.com tints every product page differently. See
  // `productAccent` for why each product got the hue it did.
  const tone = productAccent[slug] ?? 'brand'

  return (
    <section className="-mt-14 pt-[calc(3.5rem+5rem)] lg:-mt-16 lg:pt-[calc(4rem+7rem)] relative overflow-hidden pb-24 lg:pb-32">
      {/* `spread` widens the accent until it carries the whole hero, so the
          emblem below sits in a lit space rather than on a dark band. */}
      <HeroBackdrop tone={tone} spread />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* The emblem leads the centred hero, the way group-ib.com puts a
              rendered product mark above the headline. */}
          <div className="mb-8 flex justify-center">
            <ProductEmblem icon={Icon} tone={tone} slug={slug} />
          </div>

          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm ${toneBadge[tone]}`}>
            <Icon className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">{hero.badge}</span>
          </div>

          <h1 className="mt-8 font-display t-h1 font-semibold leading-[1.15]">
            <span className="text-text">{hero.headlineLead}</span>
            <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-ultra bg-clip-text text-transparent">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton href="/talk-to-sales" size="lg">
              Let&apos;s Talk
              <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#capabilities" variant="secondary" size="lg">
              See capabilities
            </LinkButton>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 border-t border-line-soft pt-8 sm:gap-10">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-brand">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Announcement strip directly under the hero.
 *
 * group-ib.com runs one of these on every product page (theirs currently
 * carries an AWS Marketplace listing). It is a single line, so it reads as
 * a note attached to the hero rather than a section of its own.
 */
export function ProductNotice({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div className="relative -mt-12 px-4 pb-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-center gap-3 rounded-lg border px-5 py-3.5 text-center backdrop-blur-md ${toneBadge[tone]}`}
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <p className="text-sm">{children}</p>
      </div>
    </div>
  )
}

/**
 * Mid-page call to action.
 *
 * group-ib.com breaks its long product pages with these rather than saving
 * every ask for the footer — a reader convinced by the capability section
 * should not have to scroll past four more sections to act on it.
 */
export function ProductMidCTA({
  title,
  action,
  tone,
}: {
  title: string
  action: string
  tone: Tone
}) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl ${toneGlow[tone]}`}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance font-display t-h3 font-semibold text-text">
          {title}
        </h2>
        <LinkButton href="/talk-to-sales" size="lg">
          {action}
          <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  )
}

/**
 * A real screenshot of the Difaac workspace for this product, not a mockup.
 *
 * group-ib.com backs every product claim with a screenshot of the actual
 * console, so a reader can see the interface is real before they ever
 * request a demo. Framed like a browser window — dots, an address bar — so
 * it reads unmistakably as "here is the product running", not decorative art.
 */
export function ProductScreenshot({
  tone,
  image,
  path,
}: {
  tone: Tone
  image: string
  path: string
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`pointer-events-none absolute inset-x-8 -top-8 h-40 rounded-full opacity-20 blur-3xl ${toneGlow[tone]}`}
          aria-hidden="true"
        />
        <div className="relative">
          <BrowserFrame tone={tone} image={image} path={path} />
        </div>
        <p className="mt-4 text-center text-xs text-muted-2">
          Live from the Difaac workspace — the same console your analysts use.
        </p>
      </div>
    </section>
  )
}

export function ProductBand({ band }: { band: ProductPageContent['band'] }) {
  return (
    <section className="bg-gradient-to-b from-ink to-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Eyebrow>{band.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            <span className="text-gradient-brand">{band.headline}</span>
          </h2>
          <p className="mt-4 text-lg text-body">{band.description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {band.cards.map((card) => {
            const Icon = getIcon(card.icon)
            return (
              <div
                key={card.label}
                className={`rounded-lg border bg-ink-2/60 px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${toneRing[card.tone]}`}
              >
                <div className="mb-4">
                  <GlassIcon icon={Icon} tone={card.tone} size="sm" />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-2">{card.label}</p>
                <p className="mt-3 font-display text-xl font-bold text-text">{card.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProductMetrics({ metrics }: { metrics: ProductPageContent['metrics'] }) {
  return (
    <div className="bg-ink-2">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line-soft px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1.5 py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="font-display text-2xl font-semibold tracking-tight text-text lg:text-3xl">
              {metric.value}
            </span>
            <span className="text-sm text-muted-2">{metric.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductOverview({ overview }: { overview: ProductPageContent['overview'] }) {
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
                Request a demo
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
              Key capabilities
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {overview.capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="flex flex-col gap-2.5 border border-line-soft bg-ink-2 p-4 transition-colors duration-200 hover:border-brand/40"
                >
                  <h4 className="text-sm font-semibold text-text">{capability.title}</h4>
                  <p className="text-xs leading-relaxed text-body">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductFeatureGrid({ featureGrid }: { featureGrid: ProductPageContent['featureGrid'] }) {
  // `overflow-hidden` on the section is load-bearing, not cosmetic: the
  // decorative discs below are 24rem wide and anchored to its edges, so on a
  // phone they extend past the viewport and give the whole page a horizontal
  // scrollbar unless the section clips them.
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute right-0 top-0 size-96 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-96 rounded-full bg-accent-cyan/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Eyebrow>Six core capabilities</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {featureGrid.heading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureGrid.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className={`relative overflow-hidden rounded-xl border bg-ink-2/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${toneRing[item.tone]}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${toneWash[item.tone]}`} aria-hidden="true" />
                <div className="relative flex h-full flex-col gap-4 p-8">
                  <GlassIcon icon={Icon} tone={item.tone} />
                  <h3 className="font-display text-lg font-bold text-text">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProductTabs({ tabs, slug }: { tabs: ProductPageContent['tabs']; slug: string }) {
  const [activeId, setActiveId] = useState(tabs.items[0]?.id)
  const active = tabs.items.find((item) => item.id === activeId) ?? tabs.items[0]
  const tone = productAccent[slug] ?? 'brand'

  if (!active) return null

  const ActiveIcon = getIcon(active.icon)

  return (
    <section id="capabilities" className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {tabs.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{tabs.description}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div className="flex flex-col gap-2 lg:gap-3" role="tablist" aria-label="Product capabilities">
            {tabs.items.map((item) => {
              const Icon = getIcon(item.icon)
              const isActive = item.id === active.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className={`group flex items-start gap-3 rounded-lg border px-4 py-3 text-left backdrop-blur-sm transition-all duration-200 ${
                    isActive
                      ? `${toneBadge[tone]} border`
                      : 'border-line-soft hover:border-brand/30 hover:bg-ink-2/40'
                  }`}
                >
                  <Icon
                    className={`mt-0.5 size-5 shrink-0 ${isActive ? toneText[tone] : 'text-muted-2 group-hover:text-brand/60'}`}
                    aria-hidden="true"
                  />
                  <span className={`text-sm font-medium ${isActive ? 'text-text' : 'text-muted-2 group-hover:text-body'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            className="rounded-lg border border-line-soft bg-ink-2/60 p-8 backdrop-blur-sm lg:p-10"
          >
            <div className="mb-6 flex items-start gap-4">
              <GlassIcon icon={ActiveIcon} tone={tone} />
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold text-text">{active.title}</h3>
                <p className="mt-2 text-sm text-body">{active.description}</p>
              </div>
            </div>

            <ul className="flex flex-col gap-3 border-t border-line-soft pt-6">
              {active.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3 text-sm text-body">
                  <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductComparison({ comparison }: { comparison: ProductPageContent['comparison'] }) {
  const cellTone: Tone[] = ['brand', 'cyan', 'violet']

  return (
    <section className="bg-ink-2/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>How Difaac compares</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {comparison.heading}
          </h2>
          <p className="mt-4 text-body">{comparison.description}</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line-soft">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="border-b border-line-soft bg-ink">
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-text">
                  Feature
                </th>
                {comparison.columns.map((column, index) => (
                  <th scope="col" key={column} className="px-6 py-4 text-center">
                    <span
                      className={`block text-sm font-bold ${index === 0 ? 'text-brand' : 'text-muted-2'}`}
                    >
                      {column}
                    </span>
                    <span className={`block text-xs ${index === 0 ? 'text-brand/60' : 'text-muted-2/60'}`}>
                      {comparison.columnSubs[index]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, rowIndex) => (
                <tr
                  key={row.feature}
                  className={`border-b border-line-soft transition-colors hover:bg-ink-2 ${
                    rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-ink-2/30'
                  }`}
                >
                  <th scope="row" className="px-6 py-4 text-left text-sm font-medium text-text">
                    {row.feature}
                  </th>
                  {row.values.map((value, columnIndex) => (
                    <td key={comparison.columns[columnIndex]} className="px-6 py-4 text-center">
                      {value ? (
                        <span
                          className={`inline-flex items-center justify-center rounded-lg p-2 ${toneChip[cellTone[columnIndex]]}`}
                        >
                          <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </span>
                      ) : (
                        <>
                          <X className="mx-auto size-5 text-muted-2/40" aria-hidden="true" />
                          <span className="sr-only">Not included</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function ProductPillars({ pillars, slug }: { pillars: ProductPageContent['pillars']; slug: string }) {
  const tone = productAccent[slug] ?? 'brand'

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>{pillars.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {pillars.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{pillars.description}</p>
        </div>

        {/*
          Rendered as full-width rows rather than a third card grid. The page
          already carries two of those, and a run of identical grids reads as
          padding however good the content is. The horizontal split also lets
          each pillar's detail list sit beside its description instead of being
          squeezed under it.
        */}
        <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft">
          {pillars.items.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="grid grid-cols-1 gap-6 bg-ink-2/60 p-7 backdrop-blur-sm transition-colors duration-200 hover:bg-ink-3/70 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-10 lg:p-9"
              >
                <div className="flex items-center gap-4 lg:w-14 lg:flex-col lg:items-start lg:gap-3">
                  <span className={`font-display text-sm font-semibold tabular-nums ${toneText[tone]} opacity-50`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <GlassIcon icon={Icon} tone={tone} size="sm" />
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{item.description}</p>
                </div>

                <ul className="flex flex-col gap-2.5 border-t border-line-soft pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5 text-sm text-muted-2">
                      <span
                        className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProductBenefits({ benefits }: { benefits: ProductPageContent['benefits'] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Eyebrow>{benefits.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-display t-h3 font-semibold text-text">
            {benefits.heading}
          </h2>
        </div>

        {/*
          A plain two-column list rather than bordered cards. These are short
          supporting points near the foot of the page, and giving them the same
          card treatment as the capability grid above implies they carry equal
          weight — which flattens the page and makes both sections read as
          filler.
        */}
        <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-2">
          {benefits.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="flex items-start gap-4">
                <Icon
                  className="mt-0.5 size-5 shrink-0 text-brand"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
                <div>
                  <h3 className="font-display text-base font-semibold text-text">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProductFAQ({ faqs }: { faqs: ProductPageContent['faqs'] }) {
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
                    aria-controls={`faq-panel-${index}`}
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
                  <div id={`faq-panel-${index}`} className="border-t border-line-soft px-6 py-4">
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

export function ProductTrust({ trust }: { trust: ProductPageContent['trust'] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display t-h3 font-semibold text-text">
            {trust.heading}
          </h2>
          <p className="mt-4 text-pretty text-body">{trust.description}</p>
        </div>

        {/*
          A divided band, not a grid of boxes. Figures read better in a
          continuous row than in six separate containers, and dropping the card
          chrome here removes the last of the repeated grids.
        */}
        <dl className="mt-12 grid grid-cols-2 gap-y-10 py-10 lg:grid-cols-3">
          {trust.items.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center gap-1.5 px-4 text-center ${
                index % 2 === 1 ? 'border-l border-line-soft' : ''
              } lg:border-l lg:first:border-l-0 lg:[&:nth-child(4)]:border-l-0`}
            >
              <dt className="sr-only">{item.label}</dt>
              <dd className="flex flex-col items-center gap-1.5">
                <span className="font-display text-2xl font-semibold text-brand lg:text-3xl">
                  {item.stat}
                </span>
                <span className="text-sm text-body">{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
