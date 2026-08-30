import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { getIcon } from '@/components/icons/icon-map'
import { useServices } from '@/lib/api'

export default function ServicesPage() {
  const { services } = useServices()

  const groups = [
    { key: 'assessment', title: 'Assessment & Testing Services' },
    { key: 'response', title: 'Incident Response & Recovery' },
    { key: 'training', title: 'Technical Training & Masterclasses' },
    { key: 'investigation', title: 'Hi-Tech Crime & Digital Forensics' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Human Proficiency Backed by Elite Intelligence"
        description="From incident response retainers to advanced red teaming and compromise assessments, our veteran security operators extend your team's capabilities."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />

      {groups.map((group) => {
        const items = (services ?? []).filter((s) => s.group === group.key)
        if (items.length === 0) return null

        return (
          <section key={group.key} className="py-16 lg:py-24 bg-ink-2 last:border-b-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Expertise</span>
                <h2 className="text-2xl font-bold font-display text-text mt-1">{group.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const Icon = getIcon(item.icon)
                  return (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
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
                        Service details
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      <section className="py-20 lg:py-28 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Facing an active incident right now?"
            description="Our emergency Incident Response team is available 24/7/365 to contain and remediate active breaches."
          />
        </div>
      </section>
    </>
  )
}
