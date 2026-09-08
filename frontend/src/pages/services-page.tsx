import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { ProductFAQ, GlassIcon } from '@/components/product/product-sections'
import { getIcon } from '@/components/icons/icon-map'
import { serviceGroupAccent, toneText } from '@/lib/tone'
import { engagementSteps, engagementModels, servicesFaqs } from '@/lib/data/engagement'
import type { Service } from '@/lib/data/services'
import { useServices } from '@/lib/api'

/**
 * Services index.
 *
 * group-ib.com/services leads with how an engagement is run and what the
 * buyer ends up holding, then lists the catalogue, then answers the questions
 * that decide a purchase. The order matters: a grid of service cards on its
 * own tells a reader nothing the navigation had not already told them.
 *
 * The catalogue is grouped by engagement type and each group carries its own
 * accent, so the four blocks read as different kinds of work rather than the
 * same section repeated with the heading swapped.
 */

const GROUPS: { key: Service['group']; title: string; description: string }[] = [
  {
    key: 'assessment',
    title: 'Find it before they do',
    description:
      'Testing that tells you what an attacker would reach, run under written rules of engagement and reported with the evidence behind every finding.',
  },
  {
    key: 'response',
    title: 'When something is already happening',
    description:
      'Containment, scope, and evidence preservation, run by the people who will still be there when the incident report has to survive scrutiny.',
  },
  {
    key: 'investigation',
    title: 'Work out who, and how',
    description:
      'Attribution-focused investigation that draws on tracked adversary infrastructure rather than starting from a blank page.',
  },
  {
    key: 'training',
    title: 'Skills your team keeps',
    description:
      'Hands-on programmes for analysts and responders, and briefings that translate technical risk for the people who sign the budget.',
  },
]

export default function ServicesPage() {
  const { services } = useServices()

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The operators, not just the platform"
        description="Testing, response, investigation, and training delivered by the people who run them — scoped in writing before any work begins, and reported with evidence you can act on."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        secondaryCta={{ label: 'Talk to an operator', href: '/talk-to-sales' }}
      />

{/* How an engagement runs — the part a buyer is actually weighing. */}
      <section className="border-t border-line-soft bg-ink-2 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
              How we work
            </span>
            <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
              Every engagement runs the same way
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-body">
              The value of an engagement is decided before it starts and after it ends — in how
              carefully it was scoped, and in whether the fix actually held.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {engagementSteps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3 border-t-2 border-brand/40 pt-5">
                <span className="font-mono text-xs text-brand">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-base font-medium text-text">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-2">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {GROUPS.map((group) => {
        const items = (services ?? []).filter((s) => s.group === group.key)
        if (items.length === 0) return null
        const tone = serviceGroupAccent[group.key]

        return (
          <section key={group.key} className="border-t border-line-soft py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className={`text-xs font-medium uppercase tracking-[0.16em] ${toneText[tone]}`}>
                  {group.key}
                </span>
                <h2 className="mt-3 font-display t-h3 font-medium text-text">
                  {group.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-body">{group.description}</p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const Icon = getIcon(item.icon)
                  return (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
                      className="group flex flex-col justify-between gap-6 rounded-lg border border-line bg-ink-2/60 p-6 transition-colors hover:border-brand/40 hover:bg-ink-3"
                    >
                      <div className="flex flex-col gap-4">
                        <GlassIcon icon={Icon} tone={tone} size="sm" />
                        <div className="flex flex-col gap-2">
                          <h3 className="font-display text-base font-medium text-text">{item.name}</h3>
                          <p className="text-sm leading-relaxed text-body">{item.description}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-2 text-xs font-medium text-brand">
                        Service details
                        <ArrowRight
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      <section className="border-t border-line-soft bg-ink-2 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
              Engagement models
            </span>
            <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
              Two ways to work with us
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {engagementModels.map((model) => (
              <div key={model.name} className="flex flex-col gap-5 rounded-lg border border-line bg-ink/60 p-7">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-medium text-text">{model.name}</h3>
                  <p className="text-sm leading-relaxed text-body">{model.summary}</p>
                </div>
                <ul className="flex flex-col gap-3 border-t border-line-soft pt-5">
                  {model.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-muted-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-line-soft">
        <ProductFAQ faqs={servicesFaqs} />
      </div>

      <section className="border-t border-line-soft py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Facing an active incident right now?"
            highlight="active incident"
            description="Tell us what you are seeing. If it is live, we will scope containment on the call rather than after a contract round."
            primaryCta={{ label: 'Talk to an operator', href: '/talk-to-sales' }}
          />
        </div>
      </section>
    </>
  )
}
