import { Link } from 'react-router-dom'
import { ArrowRight, Users, Handshake, Mail } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { getIcon } from '@/components/icons/icon-map'
import { CompanyHero, SectionHead, Band } from '@/components/company/section-head'
import { PersonGrid } from '@/components/company/person-grid'
import {
  mission,
  founding,
  founders,
  capabilities,
  principles,
  commitments,
  office,
} from '@/lib/data/company'

/**
 * About Difaac.
 *
 * Built on group-ib.com's company grammar — an eyebrow, a plain headline with
 * one phrase in the accent, a grey line, then content, repeated with room to
 * breathe. The content is deliberately honest: what the platform does and
 * commits to, how young the company is, and the three people who built it.
 * Nothing here asserts a history Difaac has not had.
 */

const destinations = [
  {
    icon: Users,
    title: 'The team',
    description: 'The three founders building Difaac, and how the team grows from here.',
    href: '/company/team',
  },
  {
    icon: Handshake,
    title: 'Partners',
    description: 'How service providers and integrators build on Difaac.',
    href: '/company/partners',
  },
  {
    icon: Mail,
    title: 'Contact',
    description: 'Reach the team directly — questions, partnerships, or an active incident.',
    href: '/company/contact',
  },
]

export default function CompanyPage() {
  return (
    <>
      <CompanyHero
        heading={{ lead: 'Difaac builds', accent: 'intelligence-driven cyber defence' }}
        description={mission.body}
        primary={{ label: "Let's talk", href: '/talk-to-sales' }}
        secondary={{ label: 'See the platform', href: '/products' }}
        bgImage="/company-hero-3d.jpg"
      />

      {/* Aspiration — the mission stated plainly, with the one real photograph. */}
      <Band>
        <div className="flex flex-col items-center gap-12">
          <SectionHead
            eyebrow="Why we exist"
            heading={{ lead: 'Fighting cybercrime is', accent: "Difaac's reason to exist" }}
            description={mission.headline}
          />
          <div className="w-full overflow-hidden rounded-2xl border border-line">
            <img
              src="/company-planning.jpg"
              alt="The Difaac founders planning the platform's architecture around a table"
              className="aspect-[16/7] w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </Band>

      {/* Founding story, then the founders as a portrait grid — the Leadership
          Team section the way Group-IB's About page runs it. */}
      <Band muted>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow={`Founded ${founding.founded}`}
            heading={{ lead: 'Built as a', accent: 'final-year project' }}
            description={founding.story}
          />
          <PersonGrid people={founders} />
        </div>
      </Band>

      {/* Capabilities — the workhorse three-column grid. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="What we do"
            heading={{ lead: 'One platform,', accent: 'six defence layers' }}
            description="Every layer draws on the same adversary intelligence, so a signal seen in one strengthens detection across the rest."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-2 p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-ink-3 text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-medium text-text">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Band>

      {/* Principles — a plain list; the number is the only ornament, and it is
          true (these are ordered, but read as a set). */}
      <Band muted>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="How we operate"
            heading={{ lead: 'Commitments, not', accent: 'achievements' }}
            description="Written as things a customer can hold us to on the first day of a contract, rather than claims about a past."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-line bg-ink-3/40 p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-2 text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-base font-medium text-text">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-body">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Band>

      {/* Commitments — four figures that are true from day one. */}
      <Band>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="What we commit to"
            heading={{ lead: 'The service', accent: 'you actually receive' }}
          />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item) => (
              <div key={item.label} className="flex flex-col gap-2 rounded-2xl border border-line bg-ink-2 p-6">
                <dt className="font-display text-2xl font-normal text-brand">{item.value}</dt>
                <dd>
                  <span className="block text-sm font-medium text-text">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-2">{item.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      {/* Where to go next. */}
      <Band muted>
        <div className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Where we are"
            heading={{ lead: 'Built in', accent: office.city }}
            description={office.detail}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {destinations.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col gap-4 rounded-2xl border border-line bg-ink-3/40 p-6 transition-colors hover:border-brand/50"
              >
                <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-ink-2 text-brand">
                  <item.icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-medium text-text">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{item.description}</p>
                </div>
                <span className="mt-auto flex items-center gap-2 text-sm text-brand">
                  Open
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <CTABanner
          title="Talk to the people who built it"
          description="Whether you are weighing the platform or facing an active incident, you reach the team directly — there is no queue between you and an analyst."
        />
      </Band>
    </>
  )
}
