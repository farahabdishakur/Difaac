import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  Mail,
  Handshake,
  Clock,
  Zap,
  Target,
  ShieldCheck,
} from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { HeroBackdrop } from '@/components/product/product-emblem'
import { capabilities, commitments, principles, founders } from '@/lib/data/company'

const destinations = [
  {
    icon: Building2,
    title: 'Careers',
    description: 'Open roles across intelligence, detection engineering, and offensive security.',
    href: '/company/careers',
  },
  {
    icon: Handshake,
    title: 'Partners',
    description: 'MSSP, reseller, and technology partnerships.',
    href: '/company/partners',
  },
  {
    icon: Mail,
    title: 'Contact',
    description: 'Talk to the team, or reach the incident hotline.',
    href: '/company/contact',
  },
]

export default function CompanyPage() {
  return (
    <>
      <section className="hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+4rem)] pb-20 lg:-mt-16 lg:pt-[calc(4rem+6rem)] lg:pb-28">
        <HeroBackdrop tone="brand" bgImage="/company-hero-3d.jpg" spread />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Mission Narrative & Actions */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <h1 className="text-balance font-display text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-[1.15] text-text">
                Sovereign Defense. <span className="text-gradient">Relentless Precision.</span>
              </h1>

              <p className="text-pretty text-base sm:text-lg leading-relaxed text-body max-w-xl">
                Difaac unites adversary intelligence, continuous detection, and rapid containment into a sovereign defense platform engineered to safeguard vital organizations against modern threats.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <LinkButton href="/talk-to-sales" size="lg" className="font-bold shadow-lg shadow-brand/20">
                  Let&apos;s Talk
                  <ArrowRight className="size-4 ml-1.5" data-icon="inline-end" aria-hidden="true" />
                </LinkButton>
                <LinkButton href="/company/careers" variant="secondary" size="lg" className="border-line hover:border-brand">
                  Explore Careers
                </LinkButton>
              </div>

              {/* Enterprise Defense Metrics with refined icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-line-soft">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <Clock className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">24/7/365</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Continuous SOC</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <Zap className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">&lt;15 min</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Response SLA</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <Target className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">700+</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Tracked Actors</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-brand">
                    <ShieldCheck className="size-4 shrink-0" strokeWidth={2} />
                    <span className="font-display text-2xl font-black">100%</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-2 font-medium">Sovereign Data</div>
                </div>
              </div>
            </div>

            {/* Right Column: Specialists Planning Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-2xl border-2 border-brand/40 bg-ink-2/80 p-2 shadow-[0_0_60px_rgba(0,201,121,0.2)] backdrop-blur-md">
                <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-ink">
                  <img
                    src="/company-planning.jpg"
                    alt="Four Difaac founders and architects collaborating around a conference table, brainstorming and planning platform architecture"
                    className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="border-b border-line-soft bg-ink-2 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Founded April 2026
              </span>
              <h2 className="font-display t-h2 font-bold text-text">
                Built on Mission
              </h2>
              <p className="text-pretty leading-relaxed text-body">
                Difaac began at Borama University with a singular conviction: that sovereign, intelligence-driven cyber defense could be engineered locally to protect national and regional enterprise infrastructure. Today, it stands as a proven unified defense platform.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">Founders</h3>
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="flex items-center gap-4 rounded-xl border border-line-soft bg-ink-2/60 p-4 backdrop-blur-sm transition-colors hover:border-brand/30"
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 font-mono text-sm font-bold text-brand shadow-sm"
                    aria-hidden="true"
                  >
                    {founder.name[0]}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-text">{founder.name}</span>
                    <span className="block text-xs text-muted-2">{founder.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Capabilities</span>
            <h2 className="mt-2 font-display t-h2 font-bold text-text">
              Unified Defense
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-body">
              Six synchronized defense layers powered by a single real-time intelligence engine.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-line-soft/60 bg-ink-2/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-brand/40 hover:bg-ink-2"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-sm">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-text">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service commitments */}
      <section className="bg-ink-2 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Standards</span>
          <h2 className="mt-2 font-display t-h3 font-bold text-text">
            Our Commitments
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body">
            Verifiable operational standards backed by contractual service guarantees.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item) => (
              <div key={item.label} className="flex flex-col gap-2 rounded-xl border border-line-soft/50 bg-ink-3/40 p-5">
                <dt className="font-display text-2xl font-black text-brand">{item.value}</dt>
                <dd>
                  <span className="block text-sm font-semibold text-text">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-2">{item.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Principles</span>
            <h2 className="mt-2 font-display t-h2 font-bold text-text">
              How We Operate
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-body">
              The core tenets that define our engineering, analysis, and client defense.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft">
            {principles.map((item, index) => {
              const Icon = getIcon(item.icon)
              return (
                <div
                  key={item.title}
                  className="grid grid-cols-1 gap-5 bg-ink-2 p-7 transition-colors duration-200 hover:bg-ink-3 lg:grid-cols-[auto_1fr_1.4fr] lg:items-start lg:gap-10 lg:p-8"
                >
                  <div className="flex items-center gap-4 lg:w-14 lg:flex-col lg:items-start lg:gap-3">
                    <span className="font-display text-sm font-semibold tabular-nums text-brand/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-sm">
                      <Icon className="size-5" aria-hidden="true" strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>

                  <p className="text-sm leading-relaxed text-body">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Where to go next */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Navigation</span>
            <h2 className="mt-2 font-display t-h2 font-bold text-text">
              Explore Difaac
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              Connect with our team, discover career paths, or explore strategic partnerships.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {destinations.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col gap-4 rounded-xl border border-line-soft bg-ink-2 p-7 transition-all duration-200 hover:border-brand/40 hover:bg-ink-3"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-sm">
                  <item.icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{item.description}</p>
                </div>
                <span className="mt-auto flex items-center gap-2 pt-3 text-sm font-medium text-brand">
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Defend Your Enterprise"
            description="Whether evaluating our platform or responding to an active incident, our specialists are ready to assist."
          />
        </div>
      </section>
    </>
  )
}
