/**
 * Shared section components for the product marketing pages.
 *
 * Each one renders a slice of `ProductPageContent`, so all six products share a
 * single implementation and stay visually consistent. Content lives in
 * `@/lib/data/product-pages`.
 *
 * Design note — restraint, measured off group-ib.com's own product pages.
 * The whole page carries ONE accent: the product's own tone (green for XDR,
 * violet for Threat Intelligence, and so on). That colour marks emphasis;
 * green stays the colour of the buttons because action is green everywhere on
 * the site. There is deliberately no per-card colour, no glow behind every
 * icon, and no gradient wash on every panel — those read as decoration for its
 * own sake, and they are exactly what makes a page look generated rather than
 * designed. Cards are a border and a fill; the icon is a flat tile; the
 * headline is weight 400 and the accent is a colour, never a bold.
 */

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Check, X, ChevronDown } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem, HeroBackdrop } from '@/components/product/product-emblem'
import { BrowserFrame } from '@/components/shared/browser-frame'
import { productAccent, toneText, toneBadge } from '@/lib/tone'
import type { Tone } from '@/lib/tone'
import type { ProductPageContent } from '@/lib/data/product-pages'

/**
 * A flat, bordered icon tile. No glow, no backdrop blur — the icon reads as a
 * labelled mark, and the page's one accent is the icon's colour rather than a
 * halo around it.
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
  const boxSize = { sm: 'size-10', md: 'size-11', lg: 'size-12' }[size]
  const iconSize = { sm: 'size-5', md: 'size-5', lg: 'size-6' }[size]

  return (
    <span
      className={`inline-flex ${boxSize} shrink-0 items-center justify-center rounded-xl border border-line bg-ink-3`}
    >
      <Icon className={`${iconSize} ${toneText[tone]}`} aria-hidden="true" strokeWidth={1.6} />
    </span>
  )
}

/**
 * Section label. Small, in the page's one accent, above each heading — the way
 * every Group-IB section opens. Follows the product's tone so the page reads
 * as one colour instead of a green mark sitting among violet ones.
 */
function Eyebrow({ children, tone = 'brand' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] ${toneText[tone]}`}
    >
      <span className="inline-block size-1.5 rounded-full bg-current" aria-hidden="true" />
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
  // way group-ib.com tints every product page differently.
  const tone = productAccent[slug] ?? 'brand'

  return (
    <section className="relative -mt-14 overflow-hidden pt-[calc(3.5rem+3rem)] pb-16 sm:pt-[calc(3.5rem+4.5rem)] sm:pb-20 lg:-mt-16 lg:pt-[calc(4rem+5rem)] lg:pb-24 min-h-[580px] lg:min-h-[660px] flex flex-col justify-center items-center">
      {/* `spread` widens the accent until it carries the whole hero, so the emblem below sits in a lit space rather than on a dark band. */}
      <HeroBackdrop tone={tone} spread slug={slug} />

      {/* Left-aligned, Group-IB style: the icon, label, headline, text and
          buttons all sit in a column on the left, over the dark hero
          animation, with the visual showing through on the right. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col items-start text-left">
          <div className="mb-6 flex items-center justify-start">
            <ProductEmblem icon={Icon} tone={tone} slug={slug} size="hero" />
          </div>

          {/* The product-name label — plain text in the page's accent, uppercase tracking, Group-IB style */}
          <p className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] ${toneText[tone]}`}>
            {hero.badge}
          </p>

          {/* The accent is a colour on the operative phrase, not a second weight. */}
          <h1 className="mt-6 text-balance font-display t-h1 font-bold text-text">
            <span className="text-text">{hero.headlineLead}</span>{' '}
            <span className={toneText[tone]}>{hero.headlineAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base sm:text-lg leading-relaxed text-body">
            {hero.description}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-row flex-wrap items-center justify-start gap-3 sm:gap-4">
            <LinkButton href="/talk-to-sales" size="lg">
              Request a demo
              <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#capabilities" variant="secondary" size="lg">
              See capabilities
            </LinkButton>
          </div>

          <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-start gap-8 border-t border-line-soft/80 pt-8 sm:gap-14">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="text-left">
                <div className={`font-display text-2xl sm:text-3xl font-normal ${toneText[tone]}`}>{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One-line note directly under the hero — a single plain sentence rather than
 * a boxed, coloured strip. It reads as a caption attached to the hero, so it
 * carries no border, fill, or icon competing with the headline above it.
 */
export function ProductNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -mt-8 px-4 pb-4 sm:px-6 lg:px-8">
      <p className="mx-auto max-w-3xl text-center text-sm text-body">{children}</p>
    </div>
  )
}

/**
 * Mid-page call to action — an ask partway down the page for the reader who is
 * already convinced, rather than saving every ask for the footer.
 */
export function ProductMidCTA({
  title,
  action,
}: {
  title: string
  action: string
  tone?: Tone
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance font-display t-h3 font-normal text-text">{title}</h2>
        <LinkButton href="/talk-to-sales" size="lg">
          {action}
          <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  )
}

/**
 * A real screenshot of the Difaac workspace for this product, framed like a
 * browser window so it reads as "here is the product running", not art.
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
        <BrowserFrame tone={tone} image={image} path={path} />
        <p className="mt-4 text-center text-xs text-muted-2">
          Live from the Difaac workspace — the same console your analysts use.
        </p>
      </div>
    </section>
  )
}

export function ProductBand({ band, tone = 'brand' }: { band: ProductPageContent['band']; tone?: Tone }) {
  return (
    <section className="bg-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>{band.eyebrow}</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{band.headline}</h2>
          <p className="max-w-2xl text-lg text-body">{band.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {band.cards.map((card) => {
            const Icon = getIcon(card.icon)
            return (
              <div key={card.label} className="rounded-2xl border border-line bg-ink px-6 py-8">
                <div className="mb-4">
                  <GlassIcon icon={Icon} tone={tone} size="sm" />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-2">{card.label}</p>
                <p className="mt-3 font-display text-xl font-normal text-text">{card.value}</p>
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
    <div className="border-y border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1.5 py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="font-display text-2xl font-normal tracking-tight text-text lg:text-3xl">
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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display t-h3 font-normal text-text">{overview.title}</h2>
            <p className="leading-relaxed text-body">{overview.body}</p>
            <div className="border-t border-line pt-6">
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
                <div key={capability.title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-ink-2 p-5">
                  <h4 className="text-sm font-medium text-text">{capability.title}</h4>
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

export function ProductFeatureGrid({
  featureGrid,
  tone = 'brand',
}: {
  featureGrid: ProductPageContent['featureGrid']
  tone?: Tone
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>Six core capabilities</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{featureGrid.heading}</h2>
        </div>

{/* Flat cards, one accent. Border and fill do the separating; there is no gradient wash or glow to make each card shout over the next. */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureGrid.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-6">
                <GlassIcon icon={Icon} tone={tone} />
                <h3 className="font-display text-lg font-medium text-text">{item.title}</h3>
                <p className="text-sm leading-relaxed text-body">{item.description}</p>
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
    <section id="capabilities" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>Capabilities</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{tabs.heading}</h2>
          <p className="max-w-2xl text-pretty text-body">{tabs.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Product capabilities">
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
                  className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    isActive
                      ? toneBadge[tone]
                      : 'border-transparent hover:bg-ink-2'
                  }`}
                >
                  <Icon
                    className={`size-5 shrink-0 ${isActive ? toneText[tone] : 'text-muted-2'}`}
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
            className="rounded-2xl border border-line bg-ink-2 p-8 lg:p-10"
          >
            <div className="mb-6 flex items-start gap-4">
              <GlassIcon icon={ActiveIcon} tone={tone} />
              <div className="flex-1">
                <h3 className="font-display text-2xl font-medium text-text">{active.title}</h3>
                <p className="mt-2 text-sm text-body">{active.description}</p>
              </div>
            </div>

            <ul className="flex flex-col gap-3 border-t border-line pt-6">
              {active.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3 text-sm text-body">
                  <Check className={`mt-0.5 size-4 shrink-0 ${toneText[tone]}`} strokeWidth={2} aria-hidden="true" />
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

export function ProductComparison({
  comparison,
  tone = 'brand',
}: {
  comparison: ProductPageContent['comparison']
  tone?: Tone
}) {
  return (
    <section className="bg-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>How Difaac compares</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{comparison.heading}</h2>
          <p className="max-w-2xl text-body">{comparison.description}</p>
        </div>

{/* `relative` gives the absolutely-positioned `sr-only` labels inside the cells a containing block *inside* this scroll box. Without it their containing block is the page itself, so on a phone they sit at the wide table's far edge and drag a horizontal scrollbar onto the whole document even though the table scrolls fine on its own. */}
        <div className="relative overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="border-b border-line bg-ink">
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-text">
                  Feature
                </th>
                {comparison.columns.map((column, index) => (
                  <th scope="col" key={column} className="px-6 py-4 text-center">
                    <span className={`block text-sm font-medium ${index === 0 ? toneText[tone] : 'text-muted-2'}`}>
                      {column}
                    </span>
                    <span className={`block text-xs ${index === 0 ? 'text-body' : 'text-muted-2/60'}`}>
                      {comparison.columnSubs[index]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, rowIndex) => (
                <tr key={row.feature} className={`border-b border-line ${rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-ink/40'}`}>
                  <th scope="row" className="px-6 py-4 text-left text-sm font-normal text-text">
                    {row.feature}
                  </th>
                  {row.values.map((value, columnIndex) => (
                    <td key={comparison.columns[columnIndex]} className="px-6 py-4 text-center">
                      {value ? (
                        <>
                          <Check className={`mx-auto size-5 ${toneText[tone]}`} strokeWidth={2.5} aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </>
                      ) : (
                        <>
                          <X className="mx-auto size-4 text-muted-2/40" aria-hidden="true" />
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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>{pillars.eyebrow}</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{pillars.heading}</h2>
          <p className="max-w-2xl text-pretty text-body">{pillars.description}</p>
        </div>

{/* Full-width rows rather than a third card grid — a run of identical grids reads as padding however good the content is. */}
        <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {pillars.items.map((item, index) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.title}
                className="grid grid-cols-1 gap-6 bg-ink-2 p-7 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-10 lg:p-9"
              >
                <div className="flex items-center gap-4 lg:w-14 lg:flex-col lg:items-start lg:gap-3">
                  <span className={`font-mono text-sm tabular-nums ${toneText[tone]}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <GlassIcon icon={Icon} tone={tone} size="sm" />
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="font-display text-lg font-medium text-text">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{item.description}</p>
                </div>

                <ul className="flex flex-col gap-2.5 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5 text-sm text-muted-2">
                      <Check className={`mt-0.5 size-4 shrink-0 ${toneText[tone]}`} strokeWidth={2} aria-hidden="true" />
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

export function ProductBenefits({ benefits, tone = 'brand' }: { benefits: ProductPageContent['benefits']; tone?: Tone }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <Eyebrow tone={tone}>{benefits.eyebrow}</Eyebrow>
          <h2 className="text-balance font-display t-h3 font-normal text-text">{benefits.heading}</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-2">
          {benefits.items.map((item) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={item.title} className="flex items-start gap-4">
                <Icon className={`mt-0.5 size-5 shrink-0 ${toneText[tone]}`} aria-hidden="true" strokeWidth={1.8} />
                <div>
                  <h3 className="font-display text-base font-medium text-text">{item.title}</h3>
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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display t-h3 font-normal text-text">Frequently asked questions</h2>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-base font-medium text-text sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-brand transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div id={`faq-panel-${index}`} hidden={!isOpen} className="pb-7">
                  <p className="max-w-2xl text-sm leading-relaxed text-body sm:text-base">{faq.answer}</p>
                </div>
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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-balance font-display t-h3 font-normal text-text">{trust.heading}</h2>
          <p className="max-w-2xl text-pretty text-body">{trust.description}</p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-y-10 py-10 lg:grid-cols-3">
          {trust.items.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col items-center gap-1.5 px-4 text-center ${
                index % 2 === 1 ? 'border-l border-line' : ''
              } lg:border-l lg:first:border-l-0 lg:[&:nth-child(4)]:border-l-0`}
            >
              <dt className="sr-only">{item.label}</dt>
              <dd className="flex flex-col items-center gap-1.5">
                <span className="font-display text-2xl font-normal text-text lg:text-3xl">{item.stat}</span>
                <span className="text-sm text-body">{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
