import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { ShieldCheck, Network, Award, ArrowRight } from 'lucide-react'

export default function PartnersPage() {
  const partnerTypes = [
    {
      title: 'Managed Security Service Providers (MSSPs)',
      desc: 'Embed Difaac Threat Intelligence and Managed XDR feeds into your SOC offerings to deliver high-margin threat hunting to your clients.',
      icon: Network,
    },
    {
      title: 'Technology Integrators & SIEM/SOAR Vendors',
      desc: 'Integrate STIX/TAXII indicator feeds and automated enrichment APIs directly into existing security stack products.',
      icon: ShieldCheck,
    },
    {
      title: 'Channel & Advisory Partners',
      desc: 'Deliver Difaac attack surface management, digital risk protection, and IR retainers with dedicated technical support and deal registration.',
      icon: Award,
    },
  ]

  return (
    <>
      <PageHero
        tone="violet"
        centered={true}
        title="Scale Security Value with Difaac Intelligence"
        description="Partner with Difaac to empower your security operations, increase recurring revenue, and protect client ecosystems against modern cybercrime."
        backgroundImage="/company/partners-hero-bg.jpg"
      />

      <section className="py-16 lg:py-24 bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Partner Tracks</span>
            <h2 className="font-display text-3xl font-bold text-text mt-1">Built for Strategic Alignment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((pt, idx) => {
              const Icon = pt.icon
              return (
                <div key={idx} className="flat-card p-8 flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-sm">
                      <Icon className="size-6" strokeWidth={1.8} />
                    </span>
                    <h3 className="font-display text-xl font-bold text-text">{pt.title}</h3>
                    <p className="text-sm text-body leading-relaxed">{pt.desc}</p>
                  </div>
                  <div className="mt-8">
                    <LinkButton href="/talk-to-sales" size="sm" variant="secondary" className="w-full justify-center border-line">
                      Become a Partner
                      <ArrowRight className="size-3.5 ml-1" />
                    </LinkButton>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-ink border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Ready to elevate your security portfolio?"
            description="Speak with our Global Channel Team to discuss partner tier requirements, margin structures, and joint go-to-market programs."
          />
        </div>
      </section>
    </>
  )
}
