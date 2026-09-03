import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { Sparkles, Code2, GraduationCap } from 'lucide-react'

const reasons = [
  {
    icon: Sparkles,
    title: 'Build the platform, not maintain someone else’s',
    description:
      'Difaac is early. Whatever you touch — detection logic, the SOC workspace, the platform itself — you are shaping how it works, not fitting into a system that already exists.',
  },
  {
    icon: Code2,
    title: 'Direct ownership from day one',
    description:
      'A small team means no layer between an idea and shipping it. What you build is what customers use.',
  },
  {
    icon: GraduationCap,
    title: 'Started by students, open to the same drive',
    description:
      'Difaac began as a Borama University final-year project. We look for the same curiosity and follow-through that took it from an assignment to a working platform.',
  },
]

export default function CareersPage() {
  return (
    <>
      <PageHero
        tone="brand"
        eyebrow="Careers at Difaac"
        title="We're a small team building something ambitious"
        description="Difaac was founded by three students in Somaliland and is still early. There are no open roles listed right now, but if you want to help build an intelligence-driven defence platform from the ground up, we want to hear from you."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Company', href: '/company' },
          { label: 'Careers' },
        ]}
      />

      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Why Difaac</span>
            <h2 className="font-display t-h2 font-bold text-text mt-2">What working here actually looks like</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="flat-card p-6 flex flex-col gap-3">
                <reason.icon className="size-8 text-brand" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-text">{reason.title}</h3>
                <p className="text-sm text-body leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-ink border-t border-line">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Open roles</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-text">Nothing posted right now</h2>
          <p className="mt-4 text-sm leading-relaxed text-body">
            We are not hiring for specific positions at the moment. That will change as Difaac
            grows — until then, an introduction from someone who wants to build this with us is
            worth more than a role we invented to fill this page.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Want to build this with us?"
            description="Send us a note about what you would bring — we read every one."
          />
        </div>
      </section>
    </>
  )
}
