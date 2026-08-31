import { HeroSection } from '@/components/home/hero-section'
import { PlatformOverview } from '@/components/home/platform-overview'
import { ProductsOverview } from '@/components/home/products-overview'
import { StatsBand } from '@/components/home/stats-band'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ResourcesPreview } from '@/components/home/resources-preview'
import { CTABanner } from '@/components/shared/cta-banner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlatformOverview />
      <ProductsOverview />
      <StatsBand />
      <TestimonialsSection />
      <ResourcesPreview />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Ready to see your risk before attackers do?"
            description="Talk to a Difaac security expert and get a tailored view of your exposure across the surface, dark web, and fraud landscape."
          />
        </div>
      </section>
    </>
  )
}


