import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { Button } from '@/components/ui/button'
import { Shield, MapPin, Briefcase, ChevronRight } from 'lucide-react'

const openRoles = [
  { title: 'Senior Threat Intelligence Analyst', location: 'New York, USA / Remote', department: 'Threat Research' },
  { title: 'Principal Malware Reverse Engineer', location: 'Amsterdam, Netherlands', department: 'Threat Research' },
  { title: 'SOC Lead Responder (24/7 Shift)', location: 'Singapore / Remote', department: 'Managed XDR' },
  { title: 'Full Stack Engineer - Detection Platform', location: 'Remote (US/EU)', department: 'Engineering' },
  { title: 'Enterprise Account Executive', location: 'London, UK', department: 'Sales' },
]

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers at Difaac"
        title="Join the Mission to Eradicate Cybercrime"
        description="We combine cutting-edge threat intelligence technology with elite human proficiency. Work alongside world-class security researchers and engineers."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Company', href: '/company' },
          { label: 'Careers' },
        ]}
      />

      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Culture & Impact</span>
            <h2 className="font-display text-3xl font-bold text-text mt-2">Why Build Your Career at Difaac?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flat-card p-6 flex flex-col gap-3">
              <Shield className="size-8 text-brand" />
              <h3 className="font-display text-lg font-bold text-text">Direct Adversary Exposure</h3>
              <p className="text-sm text-body leading-relaxed">
                Investigate closed cybercrime forums, dark web marketplaces, and state-sponsored APT campaigns in real-time.
              </p>
            </div>

            <div className="flat-card p-6 flex flex-col gap-3">
              <Briefcase className="size-8 text-brand" />
              <h3 className="font-display text-lg font-bold text-text">Global Work Flexibility</h3>
              <p className="text-sm text-body leading-relaxed">
                Distributed threat operations centers in 8 global hubs with hybrid and remote options for senior roles.
              </p>
            </div>

            <div className="flat-card p-6 flex flex-col gap-3">
              <MapPin className="size-8 text-brand" />
              <h3 className="font-display text-lg font-bold text-text">Continuous Advancement</h3>
              <p className="text-sm text-body leading-relaxed">
                Generous training budgets, conference sponsorships (DEF CON, Black Hat), and specialized certification funding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 lg:py-24 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Openings</span>
              <h2 className="font-display text-2xl font-bold text-text mt-1">Current Opportunities</h2>
            </div>
            <span className="text-xs text-muted-2">{openRoles.length} active roles</span>
          </div>

          <div className="flex flex-col gap-3">
            {openRoles.map((role, idx) => (
              <div
                key={idx}
                className="flat-card flat-card-hover p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-brand">{role.department}</span>
                  <h3 className="font-display text-lg font-bold text-text">{role.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-body">
                    <MapPin className="size-3.5 text-muted-2" />
                    <span>{role.location}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-line group-hover:border-brand group-hover:text-brand">
                  Apply Now
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Don't see your specific role?"
            description="We are always hunting for exceptional threat researchers, malware analysts, and security engineers. Send us your CV."
          />
        </div>
      </section>
    </>
  )
}
