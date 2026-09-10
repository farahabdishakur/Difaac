import { useParams } from 'react-router-dom'

import { useSeo } from '@/lib/seo'
import {
  ProductHero,
  ProductNotice,
  ProductScreenshot,
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
 * The console each product ships, shown on its page as a real screenshot of
 * the running workspace rather than a mock-up.
 *
 * Regenerate the images with `backend/capture_console_screenshots.py` after
 * changing a dashboard, or the page will advertise an interface that no
 * longer exists.
 */
const workspaceScreenshot: Record<string, { image: string; path: string }> = {
  'threat-intelligence': { image: '/screenshots/workspace-threat-intelligence.webp', path: '/workspace/threat-intelligence' },
  'fraud-protection': { image: '/screenshots/workspace-fraud.webp', path: '/workspace/fraud' },
  'managed-xdr': { image: '/screenshots/workspace-managed-xdr.webp', path: '/workspace/managed-xdr' },
  'attack-surface-management': { image: '/screenshots/workspace-attack-surface.webp', path: '/workspace/attack-surface' },
  'digital-risk-protection': { image: '/screenshots/workspace-digital-risk.webp', path: '/workspace/digital-risk' },
  'business-email-protection': { image: '/screenshots/workspace-email-protection.webp', path: '/workspace/email-protection' },
}

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

  // Called before the early return, because a hook has to run in the same
  // order on every render. When there is no content the values are harmless
  // placeholders and the component hands off to the fallback below anyway.
  useSeo({
    title: content ? `${content.hero.badge}` : 'Products',
    description: content?.hero.description ?? '',
    path: slug ? `/products/${slug}` : '/products',
  })

  if (!content || !slug) {
    return <ProductDetailPage />
  }

  const product = getProductBySlug(slug)
  const name = product?.name ?? content.hero.badge
  const tone = productAccent[slug] ?? 'brand'
  const screenshot = workspaceScreenshot[slug]

  return (
    <>
      <ProductHero hero={content.hero} slug={slug} />
      <ProductNotice>
        {name} is delivered through the Difaac Unified Risk Platform — one deployment, shared
        intelligence across every product you run.
      </ProductNotice>

      {screenshot ? <ProductScreenshot tone={tone} image={screenshot.image} path={screenshot.path} /> : null}

      <ProductBand band={content.band} tone={tone} />
      <ProductMetrics metrics={content.metrics} />
      <ProductOverview overview={content.overview} />
      <ProductFeatureGrid featureGrid={content.featureGrid} tone={tone} />
      <ProductTabs tabs={content.tabs} slug={slug} />

      <ProductMidCTA
        tone={tone}
        title={`See what ${name} surfaces in your environment`}
        action="Book a walkthrough"
      />

      <ProductComparison comparison={content.comparison} tone={tone} />
      <ProductPillars pillars={content.pillars} slug={slug} />
      <ProductBenefits benefits={content.benefits} tone={tone} />
      <ProductTrust trust={content.trust} />

      <ProductDemoForm productName={name} productSlug={slug} tone={tone} />
      <ProductFAQ faqs={content.faqs} />
    </>
  )
}
