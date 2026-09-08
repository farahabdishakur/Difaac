import { ShieldCheck, FileCheck, Lock, MapPin } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { ProductCard } from '@/components/cards/product-card'
import { CTABanner } from '@/components/shared/cta-banner'
import { SectionHeading } from '@/components/shared/section-heading'
import { useProducts } from '@/lib/api'

// Four things a buyer can check, rather than four certifications. Difaac
// holds none of SOC 2, ISO 27001 or a GDPR attestation, and with eight people
// it does not staff a desk around the clock either — claiming any of that on a
// live domain is a claim a customer can disprove, and it contradicted the
// privacy policy, which says plainly that nobody has audited us.
//
// Each of these is true today and stays true: the isolation is enforced by
// PostgreSQL row-level security, the rules of engagement are written into the
// subscription terms, and the team is where it says it is.
const trustBadges = [
  { icon: ShieldCheck, label: 'Tenant-isolated data' },
  { icon: FileCheck, label: 'Rules of engagement agreed first' },
  { icon: Lock, label: 'Encrypted in transit' },
  { icon: MapPin, label: 'Built in Borama, Somaliland' },
]

export default function ProductsPage() {
  const { products, isLoading, error } = useProducts()

  return (
    <>
      <PageHero
        centered
        title="One platform for every layer of defense"
        description="Difaac unifies six products into a single intelligence-driven platform, so your team can detect, investigate, and respond without switching tools."
        secondaryCta={{ label: 'Compare products', href: '/subscriptions' }}
      />

      <div className="bg-ink-2">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-sm text-muted-2">
              <badge.icon className="size-4 shrink-0 text-brand" aria-hidden="true" strokeWidth={1.5} />
              {badge.label}
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="The platform"
            title="Six products, one intelligence layer"
            description="Every product draws on the same adversary intelligence, so a signal detected in one area strengthens detection across the rest."
          />

          <div className="mt-12">
            {error ? (
              <p className="text-sm text-error">Unable to load products right now. Please try again shortly.</p>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-56 animate-pulse border border-line-soft bg-ink-2" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products?.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Not sure where to start?"
            description="Tell us about your environment and we will recommend the right combination of products for your team."
          />
        </div>
      </section>
    </>
  )
}
