import { useParams } from 'react-router-dom'
import {
  ProductHero,
  ProductNotice,
  ProductMidCTA,
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
import { ProductDemoForm } from '@/components/product/product-demo-form'
import { getProductPage, productAccent } from '@/lib/data/product-pages'
import { getProductBySlug } from '@/lib/data/products'
import ProductDetailPage from '@/pages/product-detail-page'

/**
 * Marketing page for a product that has full page content authored in
 * `product-pages.ts`. Products without an entry fall back to the generic,
 * API-driven detail page so a new product is never a dead route.
 *
 * Section order follows the shape group-ib.com uses on its own product
 * pages: hero, a one-line notice, the capability material, an ask partway
 * down for the reader who is already convinced, the remaining evidence,
 * then the demo form and FAQ. The ask is deliberately not saved for the
 * footer alone.
 */
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const content = getProductPage(slug)

  if (!content || !slug) {
    return <ProductDetailPage />
  }

  const product = getProductBySlug(slug)
  const name = product?.name ?? content.hero.badge
  const tone = productAccent[slug] ?? 'brand'

  return (
    <>
      <ProductHero hero={content.hero} slug={slug} />
      <ProductNotice tone={tone}>
        {name} is delivered through the Difaac Unified Risk Platform — one deployment, shared
        intelligence across every product you run.
      </ProductNotice>

      <ProductBand band={content.band} />
      <ProductMetrics metrics={content.metrics} />
      <ProductOverview overview={content.overview} />
      <ProductFeatureGrid featureGrid={content.featureGrid} />
      <ProductTabs tabs={content.tabs} slug={slug} />

      <ProductMidCTA
        tone={tone}
        title={`See what ${name} surfaces in your environment`}
        action="Book a walkthrough"
      />

      <ProductComparison comparison={content.comparison} />
      <ProductPillars pillars={content.pillars} slug={slug} />
      <ProductBenefits benefits={content.benefits} />
      <ProductTrust trust={content.trust} />

      <ProductDemoForm productName={name} tone={tone} />
      <ProductFAQ faqs={content.faqs} />
    </>
  )
}
