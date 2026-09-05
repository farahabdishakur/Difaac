import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { CompanyHero, SectionHead, Band } from '@/components/company/section-head'
import { PersonGrid } from '@/components/company/person-grid'
import { founders, teamNote } from '@/lib/data/company'

/**
 * The Team page.
 *
 * group-ib.com's team page is one component repeated: a portrait grid of the
 * leadership. Difaac's honest version of that is three founders, shown as
 * three cards — with monograms rather than invented headshots, because a
 * fabricated face is exactly the kind of thing the company's own principles
 * say it will not put in front of anyone. The page says plainly that three is
 * the whole team today.
 */
export default function TeamPage() {
  return (
    <>
      <CompanyHero
        heading={{ lead: 'Meet the people', accent: 'building Difaac' }}
        description={teamNote}
        primary={{ label: 'Build this with us', href: '/company/careers' }}
        secondary={{ label: 'About the company', href: '/company' }}
        bgImage="/company-hero-3d.jpg"
      />

      {/* The Leadership — the portrait grid, built the way Group-IB's team
          page builds it. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="The Leadership"
            heading={{ lead: 'Three people,', accent: 'one platform' }}
            description="Difaac was built by three computer-science students at Borama University. They still build it."
          />
          <PersonGrid people={founders} />
        </div>
      </Band>

      {/* How the team grows — honest: no advisory board yet, an open door. */}
      <Band muted>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <SectionHead
            align="left"
            eyebrow="From here"
            heading={{ lead: 'The team grows', accent: 'with the platform' }}
            description="As Difaac takes on more, the team will too — in detection engineering, analysis, and offensive security. This page will grow with it. Until then, an introduction from someone who wants to build this is worth more than a title we invented to fill space."
          />
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-3/40 p-8">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
              Want in early?
            </span>
            <p className="text-pretty leading-relaxed text-body">
              The earliest people shape how the platform works, not just what it does. If that is
              the kind of seat you are looking for, we want to hear from you.
            </p>
            <Link
              to="/company/careers"
              className="group mt-2 inline-flex items-center gap-2 text-sm text-brand"
            >
              See how we hire
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </Band>

      <Band>
        <CTABanner
          title="Come build it with us"
          description="We are small and early, and that is the point. Tell us what you would bring."
          primaryCta={{ label: 'Get in touch', href: '/company/careers' }}
        />
      </Band>
    </>
  )
}
