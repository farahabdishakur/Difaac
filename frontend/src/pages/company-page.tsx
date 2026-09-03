import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Mail, Handshake } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { HeroBackdrop } from '@/components/product/product-emblem'
import { capabilities, commitments, mission, principles, founding, founders } from '@/lib/data/company'

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
        <HeroBackdrop tone="brand" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-muted-2">
              <li>
                <Link to="/" className="transition-colors hover:text-brand">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-body">Company</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-balance font-display t-display font-semibold leading-[1.08] text-text">
              {mission.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty t-lead leading-relaxed text-body">
              {mission.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <LinkButton href="/talk-to-sales" size="lg">
                Let&apos;s Talk
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/company/careers" variant="secondary" size="lg">
                See open roles
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="border-b border-line-soft bg-ink-2 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
                Our story · Founded {founding.founded}
              </span>
              <h2 className="font-display t-h2 font-semibold text-text">
                Three students, one final-year project
              </h2>
              <p className="text-pretty leading-relaxed text-body">{founding.story}</p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">Founders</h3>
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="flex items-center gap-4 rounded-lg border border-line-soft bg-ink-2/60 p-5 backdrop-blur-sm"
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-[2px] border border-brand/40 bg-brand/10 font-mono text-sm font-bold text-brand"
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
            <h2 className="font-display t-h2 font-semibold text-text">
              What we do
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-body">
              Six capabilities that share one intelligence layer, so a signal seen in one place
              strengthens detection everywhere else.
            </p>
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.title} className="flex items-start gap-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
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
          <h2 className="font-display t-h3 font-semibold text-text">
            What we commit to
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            How the service is operated, from the first day of a contract.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <dt className="font-display text-2xl font-semibold text-brand">{item.value}</dt>
                <dd>
                  <span className="block text-sm font-medium text-text">{item.label}</span>
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
            <h2 className="font-display t-h2 font-semibold text-text">
              How we work
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-body">
              The commitments below are the ones worth judging a security vendor on, because a
              customer can hold us to every one of them.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft">
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
                    <div className="flex size-11 items-center justify-center rounded-lg bg-brand-ink">
                      <Icon className="size-5 text-brand" aria-hidden="true" />
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
          <div className="grid gap-6 md:grid-cols-3">
            {destinations.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col gap-3 rounded-lg border border-line-soft bg-ink-2 p-7 transition-all duration-200 hover:border-brand/40 hover:bg-ink-3"
              >
                <item.icon className="size-6 text-brand" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-text">{item.title}</h3>
                <p className="text-sm leading-relaxed text-body">{item.description}</p>
                <span className="mt-auto flex items-center gap-2 pt-3 text-sm font-medium text-brand">
                  Go
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
            title="Work with us, or come and build it"
            description="Whether you are evaluating the platform or looking for your next role, we would like to hear from you."
          />
        </div>
      </section>
    </>
  )
}
