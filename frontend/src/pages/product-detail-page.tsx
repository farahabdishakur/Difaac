import { useParams } from 'react-router-dom'

import { useSeo } from '@/lib/seo'
import { ArrowRight, Check } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { SectionHead, Band } from '@/components/company/section-head'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { ProductFeatureExplorer } from '@/components/product/product-feature-explorer'
import { ProductEmblem, HeroBackdrop } from '@/components/product/product-emblem'
import { ProductCard } from '@/components/cards/product-card'
import { getIcon } from '@/components/icons/icon-map'
import { productAccent, toneText } from '@/lib/tone'
import { useProduct, useProducts } from '@/lib/api'
import { getProductContent } from '@/lib/data/product-content'
import { getProductFaqs } from '@/lib/data/product-faqs'
import NotFoundPage from '@/pages/not-found-page'

/**
 * Product detail page.
 *
 * Built on the anatomy measured off group-ib.com's own product pages: a hero
 * that names the product small and states its promise big, a tabbed feature
 * explorer where the real console does the selling, then benefits, how it
 * works, how it deploys, pricing, and an honest FAQ. Every product pours
 * through the same template — the sections do not drift between products.
 *
 * The palette follows the product's own tone the way each Group-IB product
 * page takes its own hue, while the call-to-action stays Difaac green because
 * green is the colour of action across the whole site.
 */
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, isLoading, error } = useProduct(slug)
  const { products } = useProducts()

  // Before the early returns: hooks run unconditionally or not at all. The
  // head is filled in from the slug while the fetch is in flight and
  // corrected once the product arrives.
  useSeo({
    title: product?.name ?? 'Products',
    description:
      product?.description ??
      'Difaac cyber defence products: threat intelligence, digital risk protection, fraud protection, managed XDR, attack surface management and business email protection.',
    path: slug ? `/products/${slug}` : '/products',
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-2xl border border-line bg-ink-2" />
      </div>
    )
  }

  if (error || !product) {
    return <NotFoundPage />
  }

  const Icon = getIcon(product.icon)
  const tone = productAccent[product.slug] ?? 'brand'
  const content = getProductContent(product.slug)
  const faqs = getProductFaqs(product.slug)
  const related = (products ?? []).filter((p) => p.slug !== product.slug).slice(0, 3)

  const isFraud = product.slug === 'fraud-protection'

  return (
    <>
      {/* Hero: name small, promise big, over the product's own hue. For Fraud Protection: Group-IB split hero layout showcasing the animated 3D video. */}
      <section className={`hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+3rem)] pb-16 sm:pt-[calc(3.5rem+4.5rem)] sm:pb-20 lg:-mt-16 lg:pt-[calc(4rem+5rem)] lg:pb-24 min-h-[580px] lg:min-h-[700px] flex flex-col justify-center ${isFraud ? 'items-start' : 'items-center'}`}>
        <HeroBackdrop tone={tone} slug={product.slug} spread />

        {isFraud ? (
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur-md">
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{product.name} Platform</span>
                </div>

                <h1 className="t-display text-balance font-display font-bold text-text text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.12]">
                  The Power of AI. <br className="hidden sm:inline" />
                  The Wisdom of Experts. <br />
                  <span className="text-brand-bright">Fraud Protection Redefined</span>
                </h1>

                <p className="max-w-xl text-pretty text-base sm:text-lg leading-relaxed text-body">
                  Real-time fraud prevention and client-side identity protection that stops account takeover, automated bot networks, and payment fraud as it happens across digital enterprise applications.
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <LinkButton href="/talk-to-sales" size="lg">
                    Request a demo
                    <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
                  </LinkButton>
                  <LinkButton href={`/subscriptions/${product.slug}`} variant="secondary" size="lg">
                    See pricing
                  </LinkButton>
                </div>
              </div>

              {/* Right column: gives breathing room for the animated 3D video stack on large screens, with glass telemetry pills */}
              <div className="relative hidden lg:col-span-5 lg:flex flex-col items-end justify-center gap-3.5 pointer-events-none select-none pt-12">
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-ink-2/75 px-3.5 py-2 text-xs shadow-xl backdrop-blur-md">
                  <span className="size-2 rounded-full bg-brand animate-pulse" />
                  <span className="font-mono text-muted-2">01</span>
                  <span className="font-medium text-text">Anonymous User Behavior Analysis</span>
                </div>
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-ink-2/75 px-3.5 py-2 text-xs shadow-xl backdrop-blur-md mr-4">
                  <span className="size-2 rounded-full bg-brand-bright animate-pulse" />
                  <span className="font-mono text-muted-2">02</span>
                  <span className="font-medium text-text">Biometric &amp; AI Fraud Scoring</span>
                </div>
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-ink-2/75 px-3.5 py-2 text-xs shadow-xl backdrop-blur-md">
                  <span className="size-2 rounded-full bg-accent-cyan animate-pulse" />
                  <span className="font-mono text-muted-2">03</span>
                  <span className="font-medium text-text">Device Fingerprint Telemetry</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6 lg:px-8">
            <ProductEmblem icon={Icon} tone={tone} slug={product.slug} size="hero" />

            <p className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] ${toneText[tone]}`}>
              {product.name}
            </p>

            <h1 className="t-display text-balance font-display font-bold text-text">
              {product.tagline}
            </h1>

            <p className="max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-body">
              {product.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <LinkButton href="/talk-to-sales" size="lg">
                Request a demo
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
              <LinkButton href={`/subscriptions/${product.slug}`} variant="secondary" size="lg">
                See pricing
              </LinkButton>
            </div>
          </div>
        )}
      </section>

{/* Metrics strip: a few things true from day one. */}
      {content ? (
        <div className="border-y border-line bg-ink-2">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {content.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1.5 py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className={`font-display text-2xl font-normal ${toneText[tone]}`}>
                  {metric.value}
                </span>
                <span className="text-sm text-muted-2">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

{/* Feature explorer: the console is the argument. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Capabilities"
            heading={{ lead: 'Inside', accent: product.name }}
            description={`What ${product.name} does, shown in the console your team would actually work in.`}
          />
          <ProductFeatureExplorer
            slug={product.slug}
            name={product.name}
            tone={tone}
            capabilities={product.capabilities}
          />
        </div>
      </Band>

      {content ? (
        <>
          <Band muted>
            <div className="flex flex-col gap-12">
              <SectionHead
                eyebrow="Use cases"
                heading={{ lead: 'Where teams apply', accent: product.name }}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {content.useCases.map((useCase) => (
                  <div key={useCase.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-3/40 p-6">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-ink-2 text-brand">
                      <Check className="size-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-medium leading-snug text-text">
                      {useCase.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-body">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Band>

{/* How it works: three stages, run continuously. */}
          <Band>
            <div className="flex flex-col gap-12">
              <SectionHead
                eyebrow="How it works"
                heading={{ lead: 'From signal', accent: 'to outcome' }}
                description="Three stages, run continuously rather than as a periodic engagement."
              />
              <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {content.howItWorks.map((step, index) => (
                  <li key={step.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-2 p-6">
                    <span className={`font-mono text-sm ${toneText[tone]}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-lg font-medium text-text">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-body">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Band>

          <Band muted>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
              <div className="flex flex-col gap-6">
                <SectionHead
                  align="left"
                  eyebrow="Delivery"
                  heading={{ lead: 'Built to fit', accent: 'your stack' }}
                  description={`${product.name} is delivered through standard interfaces, so it slots into the workflows you already run rather than replacing them.`}
                />
                <ul className="flex flex-col gap-3 border-t border-line pt-6">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="divide-y divide-line border-y border-line">
                {content.delivery.map((item) => (
                  <div key={item.title} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
                    <dt className="font-display text-sm font-medium text-text sm:w-48 sm:shrink-0">
                      {item.title}
                    </dt>
                    <dd className="text-sm leading-relaxed text-body">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Band>
        </>
      ) : null}

      <Band>
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-line bg-ink-2 px-6 py-14 text-center sm:px-10">
          <SectionHead
            eyebrow="Pricing"
            heading={{ lead: 'Plans for', accent: product.name }}
            description="Standard, Pro, and Enterprise tiers — compare them capability by capability on the pricing page."
          />
          <LinkButton href={`/subscriptions/${product.slug}`} size="lg">
            See {product.name} plans
            <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
          </LinkButton>
        </div>
      </Band>

      {faqs.length > 0 ? (
        <Band muted>
          <div className="flex flex-col gap-10">
            <SectionHead
              eyebrow="FAQ"
              heading={{ lead: 'Questions about', accent: product.name }}
            />
            <div className="mx-auto w-full max-w-3xl">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>
        </Band>
      ) : null}

      {related.length > 0 ? (
        <Band>
          <div className="flex flex-col gap-10">
            <SectionHead
              eyebrow="Explore more"
              heading={{ lead: 'The rest of the', accent: 'platform' }}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </Band>
      ) : null}

      <Band>
        <CTABanner
          title={`See ${product.name} in action`}
          description="Book a walkthrough with a Difaac specialist, scoped to your environment — not a generic demo."
        />
      </Band>
    </>
  )
}
