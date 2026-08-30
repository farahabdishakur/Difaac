import { useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { SectionHeading } from '@/components/shared/section-heading'
import { getIcon } from '@/components/icons/icon-map'
import { ProductCard } from '@/components/cards/product-card'
import { useProduct, useProducts } from '@/lib/api'
import { getProductContent } from '@/lib/data/product-content'
import NotFoundPage from '@/pages/not-found-page'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, isLoading, error } = useProduct(slug)
  const { products } = useProducts()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse border border-line-soft bg-ink-2" />
      </div>
    )
  }

  if (error || !product) {
    return <NotFoundPage />
  }

  const Icon = getIcon(product.icon)
  const content = getProductContent(product.slug)
  const related = (products ?? []).filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={product.name}
        description={product.description}
        icon={Icon}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
        secondaryCta={{ label: 'Request a demo', href: '/talk-to-sales' }}
      />

      {content ? (
        <div className="bg-ink-2">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line-soft px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {content.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1.5 py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-2xl font-semibold tracking-tight text-text lg:text-3xl">
                  {metric.value}
                </span>
                <span className="text-sm text-muted-2">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Overview + capabilities */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-[clamp(24px,2.6vw,32px)] font-semibold leading-tight tracking-tight text-text">
                {product.tagline}
              </h2>
              <ul className="flex flex-col gap-4 border-t border-line-soft pt-6">
                {product.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                    <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden="true" strokeWidth={2} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted-2">Capabilities</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {product.capabilities.map((capability) => (
                  <div
                    key={capability.title}
                    className="flex flex-col gap-2.5 border border-line-soft bg-ink-2 p-6 transition-colors duration-200 hover:border-brand/40"
                  >
                    <h4 className="text-base font-semibold text-text">{capability.title}</h4>
                    <p className="text-sm leading-relaxed text-body">{capability.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {content ? (
        <>
          {/* Use cases */}
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Use cases"
                title={`Where teams apply ${product.name}`}
              />
              <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
                {content.useCases.map((useCase) => (
                  <div
                    key={useCase.title}
                    className="flex flex-col gap-3 border border-line-soft bg-ink-2 p-7 transition-colors duration-200 hover:border-brand/40"
                  >
                    <h3 className="font-display text-lg font-semibold leading-snug text-text">
                      {useCase.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-body">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="How it works"
                title="From signal to outcome"
                description="Three stages, run continuously rather than as a periodic engagement."
              />
              <ol className="mt-12 grid grid-cols-1 gap-px border border-line-soft bg-line-soft md:grid-cols-3">
                {content.howItWorks.map((step, index) => (
                  <li key={step.title} className="flex flex-col gap-4 bg-ink-2 p-7 lg:p-8">
                    <span className="font-display text-sm font-semibold text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-text">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-body">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Delivery and integration */}
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
                    Delivery
                  </span>
                  <h2 className="font-display text-[clamp(24px,2.6vw,32px)] font-semibold leading-tight tracking-tight text-text">
                    Fits the stack you already run
                  </h2>
                  <p className="text-sm leading-relaxed text-body">
                    {product.name} is delivered through standard interfaces so it slots into existing
                    workflows rather than replacing them.
                  </p>
                </div>

                <dl className="divide-y divide-line-soft border-y border-line-soft">
                  {content.delivery.map((item) => (
                    <div key={item.title} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
                      <dt className="text-sm font-semibold text-text sm:w-52 sm:shrink-0">{item.title}</dt>
                      <dd className="text-sm leading-relaxed text-body">{item.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {related.length > 0 ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Explore more" title="Related products" />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title={`See ${product.name} in action`}
            description="Schedule a walkthrough with a Difaac specialist tailored to your environment."
          />
        </div>
      </section>
    </>
  )
}
