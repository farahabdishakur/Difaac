import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, ChevronDown, Info, Search, ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { productAccent } from '@/lib/tone'
import { productSubscriptions } from '@/lib/data/subscriptions'
import { products } from '@/lib/data/products'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { useSeo } from '@/lib/seo'

/**
 * Subscription plans and feature matrix.
 *
 * Built on the system group-ib.com uses for the same page, measured off the
 * live site rather than guessed at. What carries that design is restraint,
 * not the palette, so three rules hold everywhere below:
 *
 *   1. Nothing is bold. Weight stops at 500; hierarchy is size and colour.
 *   2. The accent marks action and emphasis, and nothing else. `brand` is
 *      for things you click, `brand-ultra` for the values that matter —
 *      never for badges, glows, rings, or decoration.
 *   3. Data carries no chrome. A matrix value is text on a striped row, not
 *      a pill inside a bordered capsule.
 *
 * Difaac's own greys map onto the same four roles: `ink` is the ground,
 * `ink-2` the stripe, `line` every border, `ink-3` the one raised fill.
 */

/** The switcher is derived from the catalogue so it cannot list a product
    that has no product page behind it. */
const productKeys = products
  .map((p) => p.slug)
  .filter((slug) => slug in productSubscriptions)

/** group-ib.com holds its content in a 1042px column inside a 1440px window.
    The 400px of air either side is doing as much work as anything drawn. */
const COLUMN = 'mx-auto w-full max-w-[1080px] px-4 sm:px-6'

/**
 * The matrix grid: the feature, then one column per tier.
 *
 * Written out rather than built from `tiers.length`, because Tailwind reads
 * class names out of the source text — an interpolated one is never emitted,
 * and the grid silently falls back to a single column. Every product ships
 * exactly three tiers; a fourth would need this line changed with it.
 */
const MATRIX_GRID = 'grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]'

export default function SubscriptionsPage() {
  useSeo({
    title: 'Plans and pricing',
    description:
      'What each Difaac tier covers, what it costs, and where the boundaries are — so a buyer can map their current coverage against it before talking to anyone.',
    path: '/subscriptions',
  })
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const currentSlug = slug && productSubscriptions[slug] ? slug : 'managed-xdr'
  const activeProduct = productSubscriptions[currentSlug]

  const [selectedSubTabId, setSelectedSubTabId] = useState<string>(
    activeProduct.subTabs?.[0]?.id ?? '',
  )
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSelectedSubTabId(activeProduct.subTabs?.[0]?.id ?? '')
    const open: Record<string, boolean> = {}
    activeProduct.matrix.forEach((cat) => {
      open[cat.id] = true
    })
    setOpenCategories(open)
    setSearchQuery('')
  }, [currentSlug])

  const ProductIcon = getIcon(activeProduct.icon)
  const tone = productAccent[currentSlug] ?? 'brand'

  const activeSubTab = useMemo(() => {
    if (!activeProduct.subTabs?.length) return null
    return (
      activeProduct.subTabs.find((st) => st.id === selectedSubTabId) ??
      activeProduct.subTabs[0]
    )
  }, [activeProduct, selectedSubTabId])

  const filteredMatrix = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return activeProduct.matrix

    return activeProduct.matrix
      .map((cat) => {
        if (cat.name.toLowerCase().includes(q)) return cat
        const rows = cat.rows.filter(
          (r) => r.title.toLowerCase().includes(q) || r.tooltip.toLowerCase().includes(q),
        )
        return rows.length ? { ...cat, rows } : null
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
  }, [activeProduct.matrix, searchQuery])


  // The matrix's 720px grid still widens the document below `lg` even inside
  // its own scroll container, so the page itself scrolls sideways by a couple
  // of hundred pixels. Clipping at the page root stops that, scoped to the
  // same breakpoint as the scroller: at `lg` the root returns to `visible`,
  // because a clipping root would become the sticky header's scrolling
  // ancestor and unpin it.
  return (
    <div className="overflow-x-hidden bg-ink text-text lg:overflow-x-visible">
      <section className="pt-24 pb-16 lg:pt-32">
        <div className={COLUMN}>
          <h1 className="t-h1 text-center font-display font-bold">
            <span className="block text-text">Compare Difaac plans</span>
            <span className="block text-brand-ultra">capability by capability</span>
          </h1>

{/* Product picker. A wrapping grid rather than a row of tabs: every product stays visible at once, and a long name is free to take a second line instead of forcing the row to scroll. */}
          <div className="mt-16">
            <p className="text-center text-base text-body">Choose your product:</p>

            <div
              role="tablist"
              aria-label="Choose a product"
              className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {productKeys.map((pKey) => {
                const prod = productSubscriptions[pKey]
                const Icon = getIcon(prod.icon)
                const isActive = currentSlug === pKey

                return (
                  <button
                    key={pKey}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => navigate(`/subscriptions/${pKey}`, { replace: true })}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'border-brand bg-ink-2 text-brand-ultra'
                        : 'border-transparent bg-ink-2 text-body hover:text-text'
                    }`}
                  >
                    <ProductEmblem
                      icon={Icon}
                      tone={productAccent[pKey] ?? 'brand'}
                      slug={pKey}
                      size="menu"
                    />
                    <span className="text-sm font-medium leading-snug">{prod.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-4 pt-12">
        <div className={`${COLUMN} flex flex-col items-center gap-5 text-center`}>
          <ProductEmblem icon={ProductIcon} tone={tone} slug={currentSlug} size="hero" />

          <h2 className="t-h1 font-display text-text">
            {activeProduct.name}
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-body">
            {activeProduct.tagline}
          </p>

          <Link
            to={`/products/${activeProduct.slug}`}
            className="group inline-flex items-center gap-2 text-base text-text transition-colors hover:text-brand-ultra"
          >
            Learn more about {activeProduct.name}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      {activeProduct.subTabs && activeProduct.subTabs.length > 0 && (
        <section className="pt-16">
          <div className={`${COLUMN} flex flex-col items-center gap-8`}>
{/* One control, segmented — not three cards. The selected segment is a lighter fill; nothing else changes. */}
            <div
              role="tablist"
              aria-label="Architecture domain"
              className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-ink-2 sm:flex-row"
            >
              {activeProduct.subTabs.map((subTab) => {
                const isSelected = selectedSubTabId === subTab.id
                return (
                  <button
                    key={subTab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedSubTabId(subTab.id)}
                    className={`flex-1 cursor-pointer px-6 py-5 text-center text-base leading-snug transition-colors ${
                      isSelected
                        ? 'bg-ink-3 font-medium text-text'
                        : 'text-body hover:text-text'
                    }`}
                  >
                    {subTab.label}
                  </button>
                )
              })}
            </div>

            {activeSubTab ? (
              <p className="max-w-3xl text-center text-base leading-relaxed text-muted-2">
                <span className="text-text">{activeSubTab.headline}</span>{' '}
                {activeSubTab.description}
              </p>
            ) : null}
          </div>
        </section>
      )}

      <section className="pt-24 lg:pt-32">
        <div className={COLUMN}>
          <h2 className="t-h1 text-center font-display text-text">
            Feature matrix
          </h2>

{/* Quiet by design. The matrix runs to forty rows on some products, so a filter earns its place — but it is one unadorned field, not a toolbar competing with the table it sits above. */}
          <div className="mt-8 flex justify-center">
            <label className="relative w-full max-w-sm">
              <span className="sr-only">Filter capabilities</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter capabilities"
                className="w-full rounded-lg border border-line bg-ink-2 py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-muted-2 focus:border-brand focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-12 w-full max-w-full overflow-x-auto lg:overflow-x-visible">
          <div className="min-w-[720px] lg:min-w-0">
{/* The column header spans the full width rather than the content column — that bleed is what makes it read as a band rather than a row. It pins under the site header, which is itself sticky, so the offset has to match that header's height or this slides underneath it. */}
            <div className="z-30 border-y border-line bg-ink lg:sticky lg:top-16">
              <div className={COLUMN}>
                <div className={`grid ${MATRIX_GRID} items-center gap-4 py-4`}>
                  <span className="text-base text-muted-2">Features</span>
                  {activeProduct.tiers.map((tier) => (
                    <span
                      key={tier.id}
                      className="text-center text-base font-medium text-brand-ultra"
                    >
                      {tier.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${COLUMN} pb-8`}>
          {filteredMatrix.length === 0 ? (
            <p className="py-20 text-center text-base text-muted-2">
              No capability matches “{searchQuery}”.
            </p>
          ) : (
            filteredMatrix.map((category) => {
              const isOpen = openCategories[category.id] ?? true

              return (
                <div key={category.id} className="pt-12">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategories((prev) => ({ ...prev, [category.id]: !isOpen }))
                    }
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center gap-3 pb-4 text-left"
                  >
                    <ChevronDown
                      className={`size-4 shrink-0 text-body transition-transform ${
                        isOpen ? '' : '-rotate-90'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-base text-text">{category.name}</span>
                  </button>

                  {isOpen ? (
                    <>
{/* The rule that opens each group is the one place a plain accent line appears — it says "this block belongs to that heading" without a box. */}
                      <div className="border-t-2 border-brand">
                        {category.rows.map((row, rowIndex) => (
                          <div
                            key={row.title}
                            className={`grid ${MATRIX_GRID} items-center gap-4 px-1 py-5 ${
                              rowIndex % 2 === 0 ? 'bg-ink-2' : 'bg-ink'
                            }`}
                          >
                            <div className="flex items-start gap-2 pr-2">
                              <span className="text-sm leading-snug text-muted-2">
                                {row.title}
                              </span>

{/* Hover and keyboard focus both reveal it, and no state is held for a thing that is only ever visible while it is being pointed at. */}
                              <span className="group/tip relative inline-flex shrink-0">
                                <button
                                  type="button"
                                  aria-label={`What ${row.title} means`}
                                  className="tap-target cursor-help text-muted-2 transition-colors hover:text-body focus:text-body focus:outline-none"
                                >
                                  <Info className="size-3.5" aria-hidden="true" />
                                </button>
                                <span
                                  role="tooltip"
                                  className="pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-lg border border-line bg-ink-3 p-3 text-xs leading-relaxed text-body opacity-0 shadow-2xl transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
                                >
                                  {row.tooltip}
                                </span>
                              </span>
                            </div>

                            {row.tierValues.map((value, i) => (
                              // `relative` is load-bearing: the screen-reader
                              // labels below are absolutely positioned by
                              // `sr-only`, and without a positioned ancestor
                              // their containing block is the page itself —
                              // which puts them outside the matrix's scroll
                              // container, where its clip cannot reach them.
                              // They then widen the whole document, and the
                              // page scrolls sideways on a phone.
                              <div key={i} className="relative flex justify-center">
                                {value === true ? (
                                  <>
                                    <Check
                                      className="size-5 text-brand-ultra"
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                    <span className="sr-only">Included</span>
                                  </>
                                ) : value === false ? (
                                  <>
                                    <span className="text-muted-2" aria-hidden="true">
                                      —
                                    </span>
                                    <span className="sr-only">Not included</span>
                                  </>
                                ) : (
                                  /* Values carry no chrome: text on a striped
                                     row is already legible, and a pill around
                                     every one of forty rows is forty borders
                                     competing with the data. */
                                  <span className="text-center text-sm font-medium text-text">
                                    {value}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )
            })
          )}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-32 lg:pt-40">
        <div className={COLUMN}>
          <h2 className="t-h1 text-center font-display text-text">
            Pricing
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {activeProduct.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`flex flex-col items-center gap-4 rounded-2xl border bg-ink px-8 pb-8 pt-10 text-center ${
                  tier.popular ? 'border-brand' : 'border-line'
                }`}
              >
{/* The recommended plan is marked by its border changing colour. No ribbon, badge, glow, or lift — one property on one element is unmistakable when nothing else competes. */}
                <h3 className="text-xl font-medium text-brand-ultra">{tier.name}</h3>

                <p className="text-base leading-relaxed text-body">{tier.idealFor}</p>

                <LinkButton href="/talk-to-sales" className="mt-auto pt-0">
                  Talk to sales
                </LinkButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-32 lg:pt-40">
        <div className={COLUMN}>
          <CTABanner
            title="Not sure which plan fits?"
            description="Tell us what you are defending and who is defending it. We will map your current coverage against each tier and say plainly where the gaps are."
            primaryCta={{ label: 'Talk to sales', href: '/talk-to-sales' }}
          />
        </div>
      </section>
    </div>
  )
}
