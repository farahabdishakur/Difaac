import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { getIcon } from '@/components/icons/icon-map'
import { IndustryEmblem } from '@/components/industry/industry-emblem'
import { useIndustries } from '@/lib/api'
import NotFoundPage from '@/pages/not-found-page'

export default function IndustriesPage() {
  const { industries, isLoading, error } = useIndustries()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
         <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-b-2 border-t-2 border-brand" />
      </div>
    )
  }

  if (error || !industries) {
    return <NotFoundPage />
  }

  return (
    <>
      <div className="relative overflow-hidden bg-ink">
        
        <PageHero
          eyebrow="Industries"
          title="Protecting Every Sector"
          description="Tailored threat intelligence and cyber defense solutions designed for the unique challenges of your industry."
          tone="brand"
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Industries' },
          ]}
        />
      </div>

      <section className="relative py-20 lg:py-28 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => {
              const Icon = getIcon(industry.icon)
              
              return (
                <Link
                  key={industry.slug}
                  to={`/industries/${industry.slug}`}
                  className="flat-card flat-card-hover group relative flex flex-col justify-between overflow-hidden border border-line bg-ink-3 p-8 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex flex-col gap-6">
                    <IndustryEmblem slug={industry.slug} icon={Icon} size="card" />
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl font-medium text-text">{industry.name}</h3>
                      <p className="text-body text-sm leading-relaxed">{industry.tagline}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-medium text-brand">
                    Explore solutions
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Don't see your industry?"
            description="Our platform is highly adaptable. Speak with our experts to learn how Difaac can secure your specific environment."
          />
        </div>
      </section>
    </>
  )
}
