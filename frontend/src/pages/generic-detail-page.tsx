import { useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { getIcon } from '@/components/icons/icon-map'
import { useIndustry, useSolution, useService } from '@/lib/api'
import type { Industry } from '@/lib/data/industries'
import type { Solution } from '@/lib/data/solutions'
import type { Service } from '@/lib/data/services'
import NotFoundPage from '@/pages/not-found-page'
import { LinkButton } from '@/components/shared/link-button'

export default function GenericDetailPage({ type }: { type: 'industry' | 'solution' | 'service' }) {
  const { slug } = useParams<{ slug: string }>()
  
  // Conditionally call the right hook (hooks must always run, but we only use the result of the active one)
  const { industry, isLoading: isIndLoading, error: indError } = useIndustry(type === 'industry' ? slug : undefined)
  const { solution, isLoading: isSolLoading, error: solError } = useSolution(type === 'solution' ? slug : undefined)
  const { service, isLoading: isSerLoading, error: serError } = useService(type === 'service' ? slug : undefined)

  const isLoading = isIndLoading || isSolLoading || isSerLoading
  
  let data: Industry | Solution | Service | null = null
  let eyebrow = ''
  let error = null
  
  if (type === 'industry') {
    data = industry ?? null
    eyebrow = 'Industries'
    error = indError
  } else if (type === 'solution') {
    data = solution ?? null
    eyebrow = 'Solutions'
    error = solError
  } else if (type === 'service') {
    data = service ?? null
    eyebrow = 'Services'
    error = serError
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
         <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-b-2 border-t-2 border-brand" />
      </div>
    )
  }

  if (error || !data) {
    return <NotFoundPage />
  }

  const Icon = getIcon(data.icon)

  // Find parent path
  const parentPath = `/${type === 'industry' ? 'industries' : type === 'solution' ? 'solutions' : 'services'}`

  return (
    <>
      <div className="relative overflow-hidden bg-ink">
        
        <PageHero
          eyebrow={eyebrow}
          title={data.name}
          description={data.description}
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: eyebrow, href: parentPath },
          ]}
        />
      </div>

      <section className="relative py-20 lg:py-28 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
            
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-32">
              <span className="flex size-16 items-center justify-center border border-line bg-ink-3 text-brand">
                <Icon className="size-8" aria-hidden="true" />
              </span>
              <h2 className="font-display t-h2 font-medium text-text">{data.tagline}</h2>
              <div className="h-1 w-12 bg-brand" />
              <p className="text-body text-lg leading-relaxed">{data.description}</p>
              
              <div className="mt-4">
                 <LinkButton href="/talk-to-sales" className="w-full sm:w-auto justify-center group bg-brand-ink border-brand/50 hover:bg-brand/20">
                    Request Consultation
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                 </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
               {'highlights' in data && (data as Solution).highlights?.map((highlight: string | any, idx: number) => {
                  const title = typeof highlight === 'string' ? highlight : (highlight.title || highlight.name)
                  const desc = typeof highlight === 'string' ? '' : (highlight.description || highlight.text)
                  return (
                    <div key={idx} className="flat-card flat-card-hover p-8 transition-colors duration-300">
                       <h3 className="text-xl font-medium text-text mb-3">{title}</h3>
                       {desc && <p className="text-body leading-relaxed">{desc}</p>}
                    </div>
                  )
               })}

               {(!('highlights' in data) || !(data as Solution).highlights) && (
                 <>
                  <div className="flat-card flat-card-hover p-8 sm:col-span-2 relative overflow-hidden group">
                     <h3 className="text-2xl font-display font-medium text-text mb-4 text-gradient-brand">Intelligence first</h3>
                     <p className="text-body text-lg leading-relaxed">
                       Every product here reads from the same picture of who is attacking the region and how. That is what lets a signal seen at one customer put another on guard the same week.
                     </p>
                  </div>
                  <div className="flat-card flat-card-hover p-8 transition-colors duration-300">
                     <h3 className="text-xl font-medium text-text mb-3">Caught early</h3>
                     <p className="text-body leading-relaxed">A domain registered to imitate you, a credential for sale, an exposed service — these show up long before the attack does. We watch for them.</p>
                  </div>
                  <div className="flat-card flat-card-hover p-8 transition-colors duration-300">
                     <h3 className="text-xl font-medium text-text mb-3">A person on the other end</h3>
                     <p className="text-body leading-relaxed">When something happens you talk to an engineer who works on this platform, not to a queue. We are small enough that this is still true.</p>
                  </div>
                 </>
               )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title={`Secure your ${data.name} environment`}
            description="Talk to our specialists to understand your exposure and build a resilient defense architecture."
          />
        </div>
      </section>
    </>
  )
}
