import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  SlidersHorizontal,
  Layers,
  Clock,
  Award
} from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { productSubscriptions } from '@/lib/data/subscriptions'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const productKeys = [
  'managed-xdr',
  'threat-intelligence',
  'fraud-protection',
  'digital-risk-protection',
  'attack-surface-management',
  'business-email-protection',
]

export default function SubscriptionsPage() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  
  // Set default to managed-xdr if not provided or invalid
  const currentSlug = slug && productSubscriptions[slug] ? slug : 'managed-xdr'
  const activeProduct = productSubscriptions[currentSlug]

  const [activeTab, setActiveTab] = useState(currentSlug)

  useEffect(() => {
    if (slug && productSubscriptions[slug]) {
      setActiveTab(slug)
    }
  }, [slug])

  function handleTabChange(newSlug: string) {
    setActiveTab(newSlug)
    navigate(`/subscriptions/${newSlug}`, { replace: true })
  }

  const ProductIcon = getIcon(activeProduct.icon)

  return (
    <div className="relative min-h-screen bg-ink text-text">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink bg-glow-pattern pt-16 pb-16 lg:pt-24 lg:pb-20">
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-2 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
            <span>/</span>
            <span className="text-brand">Subscription Plans</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand mb-6">
            <Sparkles className="size-3.5" />
            <span>Enterprise Subscription Plans</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl text-balance max-w-4xl mx-auto leading-[1.1]">
            Transparent, Scalable Defense for <span className="text-gradient">Every Perimeter</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-body leading-relaxed text-pretty">
            Explore flexible subscription tiers tailored for your operational requirements. From automated threat telemetry to 24/7 dedicated managed SOC operations.
          </p>

          {/* Product Switcher Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl border border-line bg-ink-2/80 backdrop-blur-md max-w-4xl mx-auto shadow-xl">
            {productKeys.map((pKey) => {
              const prod = productSubscriptions[pKey]
              const Icon = getIcon(prod.icon)
              const isActive = activeTab === pKey
              
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleTabChange(pKey)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand text-brand-ink font-semibold shadow-[0_0_20px_var(--color-brand-glow)] scale-[1.02]'
                      : 'text-body hover:text-text hover:bg-ink-3'
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{prod.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Selected Product Overview Banner */}
      <section className="bg-ink-2/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-brand/10 border border-brand/30 text-brand">
                <ProductIcon className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-bold text-text">{activeProduct.name} Plans</h2>
                  <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs font-semibold text-brand">
                    Active Catalog
                  </span>
                </div>
                <p className="text-sm text-body mt-1 max-w-2xl">{activeProduct.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <LinkButton
                href={`/products/${activeProduct.slug}`}
                variant="secondary"
                size="sm"
                className="w-full md:w-auto justify-center border-line hover:border-brand"
              >
                Product Deep Dive &rarr;
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers (3 Pricing Cards) */}
      <section className="py-20 lg:py-28 bg-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              Tailored Service Levels
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">
              Choose the Right Tier for Your Team
            </h2>
            <p className="mt-4 text-body text-sm leading-relaxed">
              Every plan is backed by Difaac's adversary intelligence network. Custom enterprise SLAs and multi-year options available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
            {activeProduct.tiers.map((tier) => {
              const isPopular = tier.popular
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 ${
                    isPopular
                      ? 'border-2 border-brand bg-ink-2 shadow-[0_0_50px_-10px_var(--color-brand-glow)] lg:-translate-y-2'
                      : 'border border-line bg-ink-2/60 hover:border-line-soft hover:bg-ink-2'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-ink shadow-md flex items-center gap-1.5">
                      <Sparkles className="size-3" />
                      {tier.badge ?? 'Recommended'}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="pb-6">
                      <h3 className="font-display text-2xl font-bold text-text">{tier.name}</h3>
                      <p className="text-xs font-medium text-brand mt-1">{tier.tagline}</p>
                      <p className="mt-4 text-xs text-body leading-relaxed bg-ink-3/80 p-3 rounded-lg border border-line-soft">
                        <span className="font-semibold text-text">Ideal for: </span>
                        {tier.idealFor}
                      </p>
                    </div>

                    {/* Highlights Badges */}
                    <div className="flex flex-wrap gap-1.5 py-4">
                      {tier.highlights.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1 text-[11px] font-medium bg-brand/10 text-brand px-2.5 py-1 rounded-md">
                          <Check className="size-3 shrink-0" />
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Features list */}
                    <div className="pt-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-2 block mb-4">
                        What's Included
                      </span>
                      <ul className="flex flex-col gap-3.5">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-body">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                              <Check className="size-2.5 stroke-[3]" />
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-10 pt-6 border-t border-line-soft">
                    <LinkButton
                      href={`/talk-to-sales?product=${activeProduct.slug}&tier=${tier.id}`}
                      variant={isPopular ? 'primary' : 'secondary'}
                      size="lg"
                      className={`w-full justify-center font-bold ${
                        isPopular
                          ? 'bg-brand text-brand-ink hover:bg-brand-bright shadow-lg shadow-brand/20'
                          : 'border-line hover:border-brand'
                      }`}
                    >
                      Let's Talk
                      <ArrowRight className="size-4 ml-2" />
                    </LinkButton>
                    <p className="text-center text-[11px] text-muted-2 mt-3">
                      Custom enterprise quote &bull; Zero commitment discovery
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix (Full Table) */}
      <section className="py-20 lg:py-28 bg-ink-2 border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              Detailed Breakdown
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">
              Complete Feature Comparison Matrix
            </h2>
            <p className="mt-4 text-body text-sm leading-relaxed">
              Compare all architectural capabilities, operational SLAs, and intelligence depth across {activeProduct.name} subscription tiers.
            </p>
          </div>

          {/* Matrix Container */}
          <div className="overflow-x-auto rounded-xl border border-line bg-ink shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line bg-ink-3/90 backdrop-blur-md sticky top-0 z-20">
                  <th className="p-5 font-display text-base font-bold text-text w-[40%]">
                    Features & Capabilities
                  </th>
                  {activeProduct.tiers.map((t) => (
                    <th key={t.id} className="p-5 text-center font-display text-sm font-bold text-text w-[20%]">
                      <div className="flex flex-col items-center gap-1">
                        <span className={t.popular ? 'text-brand' : 'text-text'}>{t.name}</span>
                        {t.popular && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-ink bg-brand px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeProduct.matrix.map((cat, catIdx) => (
                  <tr key={catIdx} className="contents">
                    <td colSpan={4} className="bg-ink-3/40 px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand border-b border-t border-line-soft">
                      {cat.name}
                    </td>
                    {cat.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-line-soft hover:bg-ink-2/50 transition-colors"
                      >
                        <td className="p-5 text-sm font-medium text-text">
                          <div className="flex flex-col gap-0.5">
                            <span>{row.title}</span>
                            {row.description && (
                              <span className="text-xs text-muted-2 font-normal">{row.description}</span>
                            )}
                          </div>
                        </td>

                        {row.tierValues.map((val, valIdx) => (
                          <td key={valIdx} className="p-5 text-center text-sm text-body">
                            {typeof val === 'boolean' ? (
                              val ? (
                                <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand mx-auto">
                                  <Check className="size-4 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex size-7 items-center justify-center rounded-full bg-ink-3 text-muted-2 mx-auto opacity-40">
                                  <X className="size-4 stroke-[2]" />
                                </span>
                              )
                            ) : (
                              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-ink-3 text-text border border-line-soft">
                                {val}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl border border-line bg-ink-3/40">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="size-5 text-brand" />
              <span className="text-sm font-medium text-text">Need a custom scope or hybrid architectural matrix?</span>
            </div>
            <LinkButton href="/talk-to-sales" size="sm" variant="secondary" className="border-line hover:border-brand">
              Request Custom Solution Architecture
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Trust & Enterprise Assurance Guarantees */}
      <section className="py-16 bg-ink border-t border-line-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-2/40 border border-line-soft">
              <ShieldCheck className="size-8 text-brand shrink-0" />
              <div>
                <h4 className="font-display text-sm font-bold text-text">Global Threat Telemetry</h4>
                <p className="text-xs text-body mt-1">700+ tracked threat actors and live dark web crawling.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-2/40 border border-line-soft">
              <Clock className="size-8 text-brand shrink-0" />
              <div>
                <h4 className="font-display text-sm font-bold text-text">&lt;15 Min Response SLA</h4>
                <p className="text-xs text-body mt-1">Guaranteed triage and active containment for critical threats.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-2/40 border border-line-soft">
              <Award className="size-8 text-brand shrink-0" />
              <div>
                <h4 className="font-display text-sm font-bold text-text">Certified Security Posture</h4>
                <p className="text-xs text-body mt-1">SOC 2 Type II, ISO 27001, and MITRE ATT&CK evaluated.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-ink-2/40 border border-line-soft">
              <Layers className="size-8 text-brand shrink-0" />
              <div>
                <h4 className="font-display text-sm font-bold text-text">Zero Infrastructure Friction</h4>
                <p className="text-xs text-body mt-1">Agentless cloud & API ingestion deployed in under 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product FAQs */}
      <section className="py-20 lg:py-28 bg-ink-2 border-t border-line">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand mb-2">
              <HelpCircle className="size-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-text">
              Questions About {activeProduct.name} Subscriptions
            </h2>
            <p className="mt-3 text-sm text-body">
              Everything you need to know about deployment, contracts, telemetry, and response SLAs.
            </p>
          </div>

          <Accordion multiple defaultValue={['faq-0']} className="space-y-4">
            {activeProduct.faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="rounded-xl border border-line bg-ink px-6 py-2"
              >
                <AccordionTrigger className="text-base font-semibold text-text hover:text-brand hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-body leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 lg:py-28 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Ready to elevate your cyber defense posture?"
            description="Speak with a Difaac security architect to customize a subscription plan suited to your infrastructure and threat profile."
          />
        </div>
      </section>
    </div>
  )
}
