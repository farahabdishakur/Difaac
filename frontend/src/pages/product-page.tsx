import { useParams } from 'react-router-dom'
import { CTABanner } from '@/components/shared/cta-banner'
import {
  ProductHero,
  ProductBand,
  ProductMetrics,
  ProductOverview,
  ProductFeatureGrid,
  ProductTabs,
  ProductComparison,
  ProductPillars,
  ProductBenefits,
  ProductFAQ,
  ProductTrust,
} from '@/components/product/product-sections'
import { getProductPage } from '@/lib/data/product-pages'
import ProductDetailPage from '@/pages/product-detail-page'

/**
 * Marketing page for a product that has full page content authored in
 * `product-pages.ts`. Products without an entry fall back to the generic,
 * API-driven detail page so a new product is never a dead route.
 */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const content = getProductPage(slug)

  if (!content) {
    return <ProductDetailPage />
  }

  return (
    <>
      <ProductHero hero={content.hero} slug={slug!} />
      <ProductBand band={content.band} />
      <ProductMetrics metrics={content.metrics} />
      <ProductOverview overview={content.overview} />
      <ProductFeatureGrid featureGrid={content.featureGrid} />
      <ProductTabs tabs={content.tabs} />
      <ProductComparison comparison={content.comparison} />
      <ProductPillars pillars={content.pillars} />
      <ProductBenefits benefits={content.benefits} />
      <ProductFAQ faqs={content.faqs} />
      <ProductTrust trust={content.trust} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner title={content.cta.title} description={content.cta.description} />
        </div>
      </section>
    </>
  )
}
