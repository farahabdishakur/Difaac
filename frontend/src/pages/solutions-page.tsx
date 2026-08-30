import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { getIcon } from '@/components/icons/icon-map'
import { useSolutions } from '@/lib/api'

export default function SolutionsPage() {
  const { solutions } = useSolutions()

  const byUseCase = (solutions ?? []).filter((s) => s.group === 'use-case')
  const byRole = (solutions ?? []).filter((s) => s.group === 'role')

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Targeted Defense for Every Challenge & Role"
        description="Whether you are protecting against specific threat vectors or empowering your security team, Difaac provides purpose-built solutions."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Solutions' },
        ]}
      />

      {/* Solutions by Role */}
      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Tailored By Role</span>
            <h2 className="text-2xl font-bold font-display text-text mt-1">Built for Security & Risk Leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {byRole.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <Link
                  key={item.slug}
                  to={`/solutions/${item.slug}`}
                  className="flat-card flat-card-hover group p-6 flex flex-col justify-between transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <span className="flex size-12 items-center justify-center bg-brand/10 text-brand">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-text mb-1">{item.name}</h3>
                      <p className="text-sm text-body leading-relaxed">{item.tagline}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-brand">
                    Explore role solution
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solutions by Use Case */}
      <section className="py-16 lg:py-24 bg-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Tailored By Use Case</span>
            <h2 className="text-2xl font-bold font-display text-text mt-1">Defend Against Critical Threat Vectors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {byUseCase.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <Link
                  key={item.slug}
                  to={`/solutions/${item.slug}`}
                  className="flat-card flat-card-hover group p-6 flex flex-col justify-between transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <span className="flex size-12 items-center justify-center bg-brand/10 text-brand">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-text mb-1">{item.name}</h3>
                      <p className="text-sm text-body leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-brand">
                    Learn more
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Need a custom security architecture?"
            description="Our threat experts will analyze your attack surface and design a tailored defense strategy."
          />
        </div>
      </section>
    </>
  )
}
