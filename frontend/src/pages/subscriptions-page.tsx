import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  SlidersHorizontal,
  Layers,
  Clock,
  Award,
  ChevronDown,
  Info,
  Search,
  ExternalLink,
  Shield,
  Activity,
  Cpu,
  Radio,
  Zap
} from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem, HeroBackdrop } from '@/components/product/product-emblem'
import { productAccent, toneText, toneBadge, toneRing, toneWash, toneGlow } from '@/lib/tone'
import { productSubscriptions } from '@/lib/data/subscriptions'
import { products } from '@/lib/data/products'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'

const productKeys = products
  .map((p) => p.slug)
  .filter((slug) => slug in productSubscriptions)

export default function SubscriptionsPage() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  
  // Resolve current active product
  const currentSlug = slug && productSubscriptions[slug] ? slug : 'managed-xdr'
  const activeProduct = productSubscriptions[currentSlug]

  // Architectural Sub-Tab for products that support it (e.g. Managed XDR: xdr, mxdr, edr)
  const [selectedSubTabId, setSelectedSubTabId] = useState<string>(
    activeProduct.subTabs?.[0]?.id ?? 'xdr'
  )

  // Accordion state: open category IDs
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

  // Search filter query within matrix
  const [searchQuery, setSearchQuery] = useState('')

  // Active tooltip hover state for accessible popup
  const [activeTooltip, setActiveTooltip] = useState<{ title: string; text: string } | null>(null)

  // Sync subtab and open all categories whenever product changes
  useEffect(() => {
    if (activeProduct.subTabs && activeProduct.subTabs.length > 0) {
      setSelectedSubTabId(activeProduct.subTabs[0].id)
    }
    // Default: open all categories
    const initialOpen: Record<string, boolean> = {}
    activeProduct.matrix.forEach((cat) => {
      initialOpen[cat.id] = true
    })
    setOpenCategories(initialOpen)
    setSearchQuery('')
  }, [currentSlug])

  function handleProductChange(newSlug: string) {
    navigate(`/subscriptions/${newSlug}`, { replace: true })
  }

  function toggleCategory(categoryId: string) {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  function expandAllCategories() {
    const allOpen: Record<string, boolean> = {}
    activeProduct.matrix.forEach(cat => {
      allOpen[cat.id] = true
    })
    setOpenCategories(allOpen)
  }

  function collapseAllCategories() {
    setOpenCategories({})
  }

  // On a narrow screen the tab row scrolls, and the product being viewed can
  // start off-screen — leaving no indication of which product the page is
  // about. Bring it into the row whenever it changes.
  const activeTabRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [currentSlug])

  const ProductIcon = getIcon(activeProduct.icon)
  const tone = productAccent[currentSlug] ?? 'brand'

  // Active sub-tab object
  const activeSubTab = useMemo(() => {
    if (!activeProduct.subTabs) return null
    return activeProduct.subTabs.find(st => st.id === selectedSubTabId) ?? activeProduct.subTabs[0]
  }, [activeProduct, selectedSubTabId])

  // Filtered matrix based on search query
  const filteredMatrix = useMemo(() => {
    if (!searchQuery.trim()) return activeProduct.matrix

    const q = searchQuery.toLowerCase().trim()
    return activeProduct.matrix
      .map(cat => {
        const matchesCategory = cat.name.toLowerCase().includes(q)
        const matchedRows = cat.rows.filter(
          r => r.title.toLowerCase().includes(q) || r.tooltip.toLowerCase().includes(q)
        )

        if (matchesCategory) {
          return cat
        }
        if (matchedRows.length > 0) {
          return {
            ...cat,
            rows: matchedRows
          }
        }
        return null
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
  }, [activeProduct.matrix, searchQuery])

  return (
    <div className="relative min-h-screen bg-ink text-text">
      {/* Top Ambient Glow Pattern */}
      <div 
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(0, 201, 121, 0.45) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 75%)'
        }}
        aria-hidden="true"
      />

      {/* Hero & Product Header */}
      {/*
        The hero follows group-ib.com's subscription pages: the product it is
        about is named on the left with the links out of it, and the product's
        own emblem stands on the right. The previous centred stack carried no
        product art at all, so every product's page looked identical above the
        fold and the emblems the products actually ship went unused.
      */}
      <section className="hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+2.5rem)] pb-10 lg:-mt-16 lg:pt-[calc(4rem+3.5rem)] lg:pb-14">
        <HeroBackdrop tone={tone} spread />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* The trail stops at the parent: the product is named in the
              headline immediately below it. */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-2">
            <Link to="/" className="transition-colors hover:text-text">Home</Link>
            <span className="text-line">/</span>
            <Link to="/products" className="transition-colors hover:text-text">Products</Link>
          </nav>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
            <div className="flex flex-col gap-4">
              <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${toneBadge[tone]}`}>
                <Layers className="size-3.5" aria-hidden="true" />
                Subscription plans
              </span>

              <h1 className="text-balance font-display t-h1 font-semibold leading-[1.15] text-text">
                {activeProduct.name}
              </h1>

              <p className="max-w-2xl text-pretty leading-relaxed text-body t-lead">
                {activeProduct.tagline}
              </p>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-2">
                {activeProduct.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <LinkButton href="/talk-to-sales" size="lg">
                  Talk to sales
                  <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
                </LinkButton>
                <LinkButton href={`/products/${activeProduct.slug}`} variant="secondary" size="lg">
                  Learn more about {activeProduct.name}
                </LinkButton>
              </div>
            </div>

            {/* Hidden below lg rather than shrunk: at phone width the emblem
                would push the plans it introduces off the first screen. */}
            <div className="hidden justify-self-center lg:block">
              <ProductEmblem icon={ProductIcon} tone={tone} slug={currentSlug} size="hero" />
            </div>
          </div>
        </div>
      </section>

      {/*
        Product switcher. One horizontal row that scrolls sideways rather than
        wrapping onto a second line, so the catalogue reads as a single row of
        tabs at every width — the shape it has on a desktop.
      */}
      <section className="relative z-10 border-y border-line bg-ink-2/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Choose a product"
            className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0"
          >
            {productKeys.map((pKey) => {
              const prod = productSubscriptions[pKey]
              if (!prod) return null
              const Icon = getIcon(prod.icon)
              const isActive = currentSlug === pKey
              const pTone = productAccent[pKey] ?? 'brand'

              return (
                <button
                  key={pKey}
                  ref={isActive ? activeTabRef : undefined}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleProductChange(pKey)}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-2.5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? `border-current ${toneText[pTone]}`
                      : 'border-transparent text-body hover:text-text'
                  }`}
                >
                  <ProductEmblem
                    icon={Icon}
                    tone={pTone}
                    slug={pKey}
                    size="tab"
                    className={isActive ? '' : 'opacity-60'}
                  />
                  <span>{prod.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Architecture domain selector, for the products that have domains. */}
      {activeProduct.subTabs && activeProduct.subTabs.length > 0 && (
      <section className="relative z-10 py-8 bg-ink-2/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-2 mb-3">
                Architectural Domain Scope:
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeProduct.subTabs.map((subTab) => {
                  const isSelected = selectedSubTabId === subTab.id
                  return (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() => setSelectedSubTabId(subTab.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${toneRing[tone]} ${toneWash[tone]}`
                          : 'border-line bg-ink-3/50 hover:bg-ink-3 hover:border-line-soft'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isSelected ? toneText[tone] : 'text-muted-2'
                        }`}>
                          {subTab.accentBadge ?? 'Module'}
                        </span>
                        {isSelected && (
                          <span className={`size-2 rounded-full bg-current ${toneText[tone]}`} />
                        )}
                      </div>
                      <div className="font-display text-sm font-bold text-text">
                        {subTab.label}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Sub-Tab Detailed Callout */}
              {activeSubTab && (
                <div className="mt-4 p-4 rounded-xl border border-line-soft bg-ink-3/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand">Domain Focus: </span>
                    <span className="text-sm font-bold text-text">{activeSubTab.headline}</span>
                    <p className="text-xs text-body mt-1 leading-relaxed">
                      {activeSubTab.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/10 px-3 py-1 rounded-lg border border-brand/20">
                      <Zap className="size-3 text-brand" />
                      Cross-Correlated in All Plans
                    </span>
                  </div>
                </div>
              )}
            </div>
        </div>
      </section>
      )}

      {/* Subscription Tiers Cards (Standard, Pro, Enterprise) */}
      <section className="py-16 lg:py-20 bg-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className={`text-xs font-bold uppercase tracking-[0.16em] ${toneText[tone]}`}>
              Tier Specifications
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-text sm:text-4xl">
              Calibrated Service Levels for Enterprise Resiliency
            </h2>
            <p className="mt-3 text-sm text-body leading-relaxed">
              Every tier delivers verified telemetry, automated threat classification, and expert oversight. Choose the operational SLA and containment depth that matches your risk posture.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
            {activeProduct.tiers.map((tier) => {
              const isPopular = tier.popular
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 transition-all duration-300 ${
                    isPopular
                      ? `border-2 bg-ink-2 lg:-translate-y-2 ${toneRing[tone]} ${toneGlow[tone]}`
                      : 'border border-line bg-ink-2/60 hover:border-line-soft hover:bg-ink-2'
                  }`}
                >
                  {isPopular && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1.5 ${toneBadge[tone]}`}>
                      <Sparkles className="size-3" />
                      <span>{tier.badge ?? 'Recommended by Security Leads'}</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="pb-5 border-b border-line-soft">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-2xl font-bold text-text">{tier.name}</h3>
                        <span className={`shrink-0 whitespace-nowrap text-xs font-bold uppercase border px-2.5 py-0.5 rounded-full ${toneBadge[tone]}`}>
                          Enterprise Ready
                        </span>
                      </div>
                      <p className={`text-xs font-medium mt-1 ${toneText[tone]}`}>{tier.tagline}</p>
                      
                      <div className="mt-4 p-3 rounded-xl bg-ink-3/90 border border-line-soft text-xs text-body leading-relaxed">
                        <span className="font-semibold text-text">Operational Fit: </span>
                        {tier.idealFor}
                      </div>
                    </div>

                    {/* Operational Highlights Badges */}
                    <div className="flex flex-wrap gap-1.5 py-4 border-b border-line-soft">
                      {tier.highlights.map((h) => (
                        <span 
                          key={h} 
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${toneBadge[tone]}`}
                        >
                          <Check className="size-3 shrink-0 stroke-[3]" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>

                    {/* Included Features List */}
                    <div className="pt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-2 block mb-3.5">
                        Architectural Inclusions
                      </span>
                      <ul className="flex flex-col gap-3">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-body">
                            <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${toneBadge[tone]}`}>
                              <Check className="size-2.5 stroke-[3]" />
                            </span>
                            <span className="leading-snug text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="mt-8 pt-6 border-t border-line-soft">
                    <LinkButton
                      href={`/talk-to-sales?product=${activeProduct.slug}&tier=${tier.id}`}
                      variant={isPopular ? 'primary' : 'secondary'}
                      size="lg"
                      className={`w-full justify-center font-bold text-sm ${
                        isPopular
                          ? 'bg-brand text-brand-ink hover:bg-brand-bright shadow-lg shadow-brand/20'
                          : 'border-line hover:border-brand text-text'
                      }`}
                    >
                      <span>Schedule Architecture Review</span>
                      <ArrowRight className="size-4 ml-2" />
                    </LinkButton>
                    <p className="text-center text-[11px] text-muted-2 mt-2.5">
                      Custom enterprise quote &bull; Tailored Proof-of-Value deployment
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Feature Comparison Matrix (Group-IB Style with Accordions & Tooltips) */}
      <section id="feature-matrix" className="py-16 lg:py-24 bg-ink-2 border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand mb-2">
                <SlidersHorizontal className="size-3.5" />
                <span>Technical Specifications</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text">
                Full Technical Feature Matrix
              </h2>
              <p className="mt-2 text-sm text-body max-w-2xl">
                Hover or tap any <Info className="inline size-3 text-brand align-middle" /> icon to review granular engineering specifications, detection mechanisms, and SLA assurances.
              </p>
            </div>

            {/* Filter and Accordion Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input within matrix */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-2" />
                <input
                  type="text"
                  placeholder="Filter capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-line bg-ink text-xs text-text placeholder:text-muted-2 focus:outline-none focus:border-brand w-44 sm:w-56"
                />
              </div>

              {/* Expand / Collapse All */}
              <button
                type="button"
                onClick={expandAllCategories}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-ink text-body hover:text-text hover:border-line-soft transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllCategories}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-ink text-body hover:text-text hover:border-line-soft transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Sticky Matrix Table Container */}
          <div className="rounded-2xl border border-line bg-ink shadow-2xl overflow-hidden">
            
            {/* Sticky Header Row (Group-IB Style) */}
            <div className="sticky top-14 lg:top-16 z-30 grid grid-cols-12 border-b border-line bg-ink-2/95 backdrop-blur-md px-4 sm:px-6 py-4 items-center">
              <div className="col-span-6 sm:col-span-5 text-left font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-text">
                Features & Architectural Specifications
              </div>
              {activeProduct.tiers.map((t) => (
                <div 
                  key={t.id} 
                  className="col-span-2 sm:col-span-2 text-center font-display text-xs sm:text-sm font-bold"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={t.popular ? 'text-brand font-extrabold' : 'text-text'}>
                      {t.name}
                    </span>
                    {t.popular && (
                      <span className="hidden sm:inline-block text-[9px] uppercase font-black tracking-widest text-brand-ink bg-brand px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Matrix Accordions */}
            {filteredMatrix.length === 0 ? (
              <div className="p-12 text-center text-body text-sm">
                No capabilities matched your filter query &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="divide-y divide-line">
                {filteredMatrix.map((cat) => {
                  const isOpen = openCategories[cat.id] ?? true
                  return (
                    <div key={cat.id} className="transition-colors">
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-ink-3/40 hover:bg-ink-3/70 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="size-2 rounded-full bg-brand" />
                          <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-brand">
                            {cat.name}
                          </h3>
                          <span className="text-[11px] font-medium text-muted-2">
                            ({cat.rows.length} {cat.rows.length === 1 ? 'feature' : 'features'})
                          </span>
                        </div>
                        <ChevronDown 
                          className={`size-4 text-muted-2 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-brand' : ''
                          }`} 
                        />
                      </button>

                      {/* Accordion Rows */}
                      {isOpen && (
                        <div className="divide-y divide-line-soft">
                          {cat.rows.map((row, rIdx) => (
                            <div 
                              key={rIdx}
                              className="grid grid-cols-12 px-4 sm:px-6 py-3.5 items-center hover:bg-ink-2/50 transition-colors"
                            >
                              {/* Feature Title with Tooltip Trigger */}
                              <div className="col-span-6 sm:col-span-5 pr-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs sm:text-sm font-medium text-text leading-snug">
                                    {row.title}
                                  </span>
                                  <div className="relative inline-block group shrink-0 mt-0.5">
                                    <button
                                      type="button"
                                      aria-label={`Details about ${row.title}`}
                                      onClick={() => setActiveTooltip(
                                        activeTooltip?.title === row.title ? null : { title: row.title, text: row.tooltip }
                                      )}
                                      className="text-muted-2 hover:text-brand focus:text-brand focus:outline-none transition-colors"
                                    >
                                      <Info className="size-3.5" />
                                    </button>

                                    {/* Desktop Hover Tooltip */}
                                    <div className="pointer-events-none absolute left-0 bottom-full mb-2 hidden w-72 rounded-xl border border-line bg-ink-2 p-3 text-xs text-body shadow-2xl group-hover:block z-50">
                                      <div className="font-semibold text-text mb-1 flex items-center gap-1.5 text-brand">
                                        <Sparkles className="size-3 text-brand" />
                                        <span>{row.title}</span>
                                      </div>
                                      <p className="leading-relaxed text-[11px] text-slate-300">
                                        {row.tooltip}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tier Values (Standard, Pro, Enterprise) */}
                              {row.tierValues.map((val, vIdx) => (
                                <div 
                                  key={vIdx}
                                  className="col-span-2 sm:col-span-2 text-center text-xs sm:text-sm px-1"
                                >
                                  {typeof val === 'boolean' ? (
                                    val ? (
                                      <span className="inline-flex size-6 sm:size-7 items-center justify-center rounded-full bg-brand/15 text-brand mx-auto shadow-sm">
                                        <Check className="size-3.5 sm:size-4 stroke-[3]" />
                                      </span>
                                    ) : (
                                      <span className="text-muted-2 text-base font-bold opacity-30 select-none">
                                        &mdash;
                                      </span>
                                    )
                                  ) : (
                                    <span className="inline-block text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-md bg-ink-3 text-text border border-line-soft max-w-full truncate">
                                      {val}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Mobile / Clicked Tooltip Modal Bar */}
          {activeTooltip && (
            <div className="mt-4 p-4 rounded-xl border border-brand/30 bg-ink-3 shadow-xl flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-brand flex items-center gap-1.5">
                  <Info className="size-3.5" />
                  <span>{activeTooltip.title}</span>
                </div>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  {activeTooltip.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTooltip(null)}
                className="text-xs font-semibold text-muted-2 hover:text-text px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          )}

          {/*
            group-ib.com closes each matrix with the plans it describes, so the
            column you just read across is the thing you can act on without
            scrolling back up the table. Deliberately compact: the full tier
            detail is the section above, and repeating it here would make the
            reader compare two descriptions of the same plan.
          */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {activeProduct.tiers.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col gap-3 rounded-2xl border p-6 ${
                  t.popular ? toneRing[tone] : 'border-line bg-ink-3/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-text">{t.name}</h3>
                  {t.popular ? (
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${toneBadge[tone]}`}>
                      Recommended
                    </span>
                  ) : null}
                </div>

                <p className="text-sm leading-relaxed text-body">{t.idealFor}</p>

                <LinkButton
                  href="/talk-to-sales"
                  variant={t.popular ? 'primary' : 'secondary'}
                  size="sm"
                  className="mt-auto w-full justify-center"
                >
                  Talk to sales
                  <ArrowRight className="size-3.5" data-icon="inline-end" aria-hidden="true" />
                </LinkButton>
              </div>
            ))}
          </div>

          {/* Custom Architecture Inquiries */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-line bg-ink-3/40">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <SlidersHorizontal className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Need a customized telemetry scope or on-premise deployment?</h4>
                <p className="text-xs text-body mt-0.5">We engineer tailored sensor architectures for air-gapped networks, multi-cloud, and high-concurrency environments.</p>
              </div>
            </div>
            <LinkButton 
              href="/talk-to-sales" 
              size="sm" 
              variant="secondary" 
              className="border-line hover:border-brand text-xs font-bold whitespace-nowrap shrink-0"
            >
              Request Custom Architecture
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Enterprise Guarantees & Operational Standards */}
      <section className="py-16 bg-ink border-t border-line-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-ink-2/50 border border-line-soft hover:border-line transition-colors">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Clock className="size-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-text">&lt; 15 Min Critical SLA</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">Guaranteed human triage and active containment for priority-1 adversary intrusions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-ink-2/50 border border-line-soft hover:border-line transition-colors">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-text">Zero Infrastructure Disruption</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">Agentless cloud & API ingestion with lightweight kernel-safe endpoint sensors.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-ink-2/50 border border-line-soft hover:border-line transition-colors">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Award className="size-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-text">Evidentiary Chain of Custody</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">Forensic dumps and triage logs compliant with international court & insurance standards.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-ink-2/50 border border-line-soft hover:border-line transition-colors">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Layers className="size-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-text">Regional Data Sovereignty</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">Full compliance with regional residency regulations, with on-premise retention options.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 lg:py-24 bg-ink-2 border-t border-line">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand mb-2">
              <HelpCircle className="size-3.5" />
              <span>Operational Clarity</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
              Frequently Asked Questions About {activeProduct.name}
            </h2>
            <p className="mt-2 text-sm text-body">
              Engineering, integration, and operational SLA specifications.
            </p>
          </div>

          <div className="space-y-4">
            {activeProduct.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-line bg-ink p-5 transition-colors open:border-line-soft open:bg-ink-3/40"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-semibold text-text hover:text-brand transition-colors list-none">
                  <span>{faq.question}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-2 transition-transform duration-200 group-open:rotate-180 group-open:text-brand ml-4" />
                </summary>
                <div className="mt-3.5 text-xs sm:text-sm text-body leading-relaxed border-t border-line-soft pt-3 text-slate-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 lg:py-24 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Defend Your Perimeter With Guaranteed SLAs"
            description="Engage with a Difaac Principal Security Architect to assess your current telemetry gaps and configure an adversary-resilient subscription model."
          />
        </div>
      </section>
    </div>
  )
}
