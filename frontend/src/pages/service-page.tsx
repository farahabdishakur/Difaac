import { useParams } from 'react-router-dom'
import { CTABanner } from '@/components/shared/cta-banner'
import {
  ServiceHero,
  ServiceFacts,
  ServiceOverview,
  ServicePhases,
  ServiceDeliverables,
  ServiceAudience,
  ServiceFAQ,
} from '@/components/service/service-sections'
import { getServicePage } from '@/lib/data/service-pages'
import { getServiceBySlug } from '@/lib/data/services'
import GenericDetailPage from '@/pages/generic-detail-page'

/**
 * Marketing page for a service that has full page content authored in
 * `service-pages.ts`. Services without an entry fall back to the generic,
 * API-driven detail page so a new service is never a dead route.
 */
export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const content = getServicePage(slug)

  if (!content) {
    return <GenericDetailPage type="service" />
  }

  const service = slug ? getServiceBySlug(slug) : undefined
  const group = service?.group ?? 'assessment'

  return (
    <>
      <ServiceHero
        hero={content.hero}
        group={group}
      />
      <ServiceFacts facts={content.facts} group={group} />
      <ServiceOverview overview={content.overview} />
      <ServicePhases phases={content.phases} />
      <ServiceDeliverables deliverables={content.deliverables} group={group} />
      <ServiceAudience audience={content.audience} group={group} />
      <ServiceFAQ faqs={content.faqs} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner title={content.cta.title} description={content.cta.description} />
        </div>
      </section>
    </>
  )
}
