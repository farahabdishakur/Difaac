import { getIcon } from '@/components/icons/icon-map'
import { CTABanner } from '@/components/shared/cta-banner'
import { CompanyHero, SectionHead, Band } from '@/components/company/section-head'
import { partnerTracks } from '@/lib/data/company'

/**
 * Partners.
 *
 * The same company grammar, applied to partnerships. Honest about the stage:
 * the programme is forming, so the page describes the shapes a partnership can
 * take and how an engagement is agreed — not tiers, margins, or a channel org
 * that does not exist yet.
 */
export default function PartnersPage() {
  return (
    <>
      <CompanyHero
        heading={{ lead: 'Build on', accent: 'Difaac intelligence' }}
        description="Difaac is designed to sit inside the security you already sell or run. If you deliver security services, integrate tooling, or advise organisations on their defence, there is a way to build on the platform together."
        primary={{ label: 'Become a partner', href: '/company/contact' }}
        secondary={{ label: 'See the platform', href: '/products' }}
        bgImage="/company/partners-hero-bg.jpg"
      />

{/* Partner tracks — the three shapes a partnership can take. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Partner tracks"
            heading={{ lead: 'Three ways to', accent: 'work together' }}
            description="Whichever fits, the terms are scoped and priced in writing before either side commits."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {partnerTracks.map((track) => {
              const Icon = getIcon(track.icon)
              return (
                <div key={track.title} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-ink-3 text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-medium text-text">{track.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{track.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Band>

{/* How it works — honest about the stage. */}
      <Band muted>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <SectionHead
            align="left"
            eyebrow="How it works"
            heading={{ lead: 'A programme', accent: 'still being built' }}
            description="Difaac is early, and so is its partner programme. That means the first partners help shape it — the terms, the support, the way we go to market — rather than signing into something fixed. We would rather agree a working arrangement with a few good partners than publish tiers we cannot yet stand behind."
          />
          <ol className="flex flex-col gap-3">
            {[
              { n: '01', t: 'Talk', d: 'Tell us what you deliver and who you deliver it to.' },
              { n: '02', t: 'Scope', d: 'We agree what each side brings, in writing, before any commitment.' },
              { n: '03', t: 'Build', d: 'Ship it to your customers, with a direct line to the people who built the platform.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-4 rounded-2xl border border-line bg-ink-3/40 p-5">
                <span className="font-mono text-sm tabular-nums text-brand/60">{step.n}</span>
                <div>
                  <span className="block text-sm font-medium text-text">{step.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-body">{step.d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band>
        <CTABanner
          title="Interested in partnering?"
          description="Tell us about your business and how you would want to work together. You will reach a founder, not a form."
          primaryCta={{ label: 'Become a partner', href: '/company/contact' }}
        />
      </Band>
    </>
  )
}
