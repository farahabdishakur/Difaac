import { ArrowRight } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { CompanyHero, SectionHead, Band } from '@/components/company/section-head'
import { careerValues } from '@/lib/data/company'

/**
 * The areas Difaac will open first. Not postings — the page is honest that no
 * role is live — but the real disciplines the platform needs people in, so the
 * "no openings" section says something a candidate can act on rather than
 * leaving a bare line under a heading.
 */
const futureAreas = [
  {
    title: 'Detection engineering',
    description: 'Writing and tuning the rules that turn raw telemetry into detections worth an analyst’s time.',
  },
  {
    title: 'Threat analysis',
    description: 'Validating detections, running down leads, and attributing activity to tracked actors.',
  },
  {
    title: 'Offensive security',
    description: 'Penetration testing and adversary simulation, reported with evidence a team can act on.',
  },
]

/**
 * Careers.
 *
 * group-ib.com's careers page runs a louder version of the same grammar and
 * closes on real openings. Difaac's honest version keeps the grammar and is
 * plain about the stage: three founders, early, no roles posted yet. The draw
 * on offer is ownership and influence — not scale or perks a three-person
 * company cannot honestly promise.
 */
export default function CareersPage() {
  return (
    <>
      <CompanyHero
        heading={{ lead: 'Build a defence platform', accent: 'from the ground up' }}
        description="Difaac was founded by three students in Somaliland and is still early. There are no roles posted right now — but if you want to help build an intelligence-driven defence platform, we want to hear from you."
        primary={{ label: 'Introduce yourself', href: '/company/contact' }}
        secondary={{ label: 'Meet the team', href: '/company/team' }}
        bgImage="/company/careers-hero-bg.jpg"
      />

{/* Why join — the honest draws, as a three-column grid. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Why Difaac"
            heading={{ lead: 'What working here', accent: 'actually looks like' }}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {careerValues.map((value) => {
              const Icon = getIcon(value.icon)
              return (
                <div key={value.title} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-ink-3 text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-medium text-text">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Band>

{/* Open roles — plainly none yet, but the section still gives a candidate something to act on: the disciplines we hire into first, and a way in before a posting exists. */}
      <Band muted>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Open roles"
            heading={{ lead: 'The roles we’re', accent: 'building toward' }}
            description="Difaac is early, so formal postings are still ahead of us. These are the disciplines we hire into first — reach out and you are known to us before a role is ever listed."
          />

          <div className="overflow-hidden rounded-2xl border border-line bg-ink-3/40">
            <div className="flex flex-col gap-1.5 border-b border-line p-6 sm:p-8">
              <h3 className="font-display text-lg font-medium text-text">Where we hire first</h3>
              <p className="text-sm leading-relaxed text-body">
                When roles open, they open in these areas. Tell us which one is yours.
              </p>
            </div>

            <ul className="divide-y divide-line">
              {futureAreas.map((area) => (
                <li
                  key={area.title}
                  className="grid grid-cols-1 gap-2 p-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8 sm:p-8"
                >
                  <span className="font-display text-base font-medium text-text">{area.title}</span>
                  <span className="text-sm leading-relaxed text-body">{area.description}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-start gap-4 border-t border-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="text-sm text-body">
                Don’t see your discipline? Reach out anyway — we would rather hear from the right
                person early than wait for the right posting.
              </p>
              <LinkButton href="/company/contact" className="shrink-0">
                Introduce yourself
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </div>
      </Band>

      <Band>
        <CTABanner
          title="Want to build this with us?"
          description="Send a note about what you would bring. We read every one."
          primaryCta={{ label: 'Get in touch', href: '/company/contact' }}
        />
      </Band>
    </>
  )
}
