import { HeroSection } from '@/components/home/hero-section'
import { PlatformTabsSection } from '@/components/home/platform-tabs-section'
import { ProductShowcase } from '@/components/home/product-showcase'
import { PlatformCommitments } from '@/components/home/platform-commitments'
import { ResourcesPreview } from '@/components/home/resources-preview'
import { CTABanner } from '@/components/shared/cta-banner'
import { useSeo } from '@/lib/seo'

/**
 * Section order follows the shape group-ib.com uses on its own homepage:
 * hero, a switcher that indexes the whole catalogue, then one full-width band
 * per product rather than a grid, then the credibility section, resources,
 * and a closing ask.
 *
 * What is deliberately absent is a customer-quote section. The slot exists on
 * comparable sites and the components for it existed here, populated with
 * invented people at invented companies. Difaac has been operating since April
 * 2026; those quotes were not real, so the section is gone rather than
 * dressed up. `PlatformCommitments` fills the same position with claims that
 * are actually true.
 */
export default function HomePage() {
  useSeo({
    title: 'Unified Risk Platform',
    description:
      "Difaac is Somalia's unified risk platform: one place to track the fraud, phishing and brand abuse targeting Somali banks, mobile money and institutions — at home and across the diaspora — and stop them first.",
    path: '/',
  })
  return (
    <>
      <HeroSection />
      <PlatformTabsSection />
      <ProductShowcase />
      <PlatformCommitments />
      <ResourcesPreview />

      <section className="border-t border-line-soft py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="See what Difaac finds in your environment"
            highlight="Difaac finds"
            description="Tell us what you are defending and we will show you the exposure, fraud, and adversary activity we can already see against it."
            secondaryCta={{ label: 'Explore products', href: '/products' }}
          />
        </div>
      </section>
    </>
  )
}
