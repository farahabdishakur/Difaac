import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { GlassIcon } from '@/components/product/product-sections'
import { getIcon } from '@/components/icons/icon-map'
import { IndustryEmblem } from '@/components/industry/industry-emblem'
import { solutionGroupAccent, toneText, INDUSTRY_ACCENT } from '@/lib/tone'
import { solutionChallenges } from '@/lib/data/engagement'
import { industries } from '@/lib/data/industries'
import { useSolutions } from '@/lib/api'
import type { Solution } from '@/lib/data/solutions'

/**
 * Solutions index.
 *
 * group-ib.com opens a solutions page with the challenge, not the product —
 * which is the right order, because a reader arrives holding a problem rather
 * than a shopping list. The page states the three problems first, each with
 * the response to it, and only then lists what to click.
 *
 * The three ways in (use case, role, sector) are the three ways people
 * actually search, so all three are on the page rather than only the two the
 * data model happens to store.
 */

const GROUPS: { key: Solution['group']; eyebrow: string; title: string; description: string }[] = [
  {
    key: 'use-case',
    eyebrow: 'By use case',
    title: 'Start from the threat',
    description:
      'You know what you are worried about — ransomware, a leak, bots on the login page. Each of these maps to the products and services that close it.',
  },
  {
    key: 'role',
    eyebrow: 'By role',
    title: 'Start from the job',
    description:
      'What a CISO needs from the platform is not what a fraud lead needs. These pages set out what the role is measured on and what the platform does about it.',
  },
]

export default function SolutionsPage() {
  const { solutions } = useSolutions()

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Start from the problem, not the product"
        description="Whether you are closing a specific threat vector, equipping a role, or defending a sector, each solution maps to the products and services that actually deliver it."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Solutions' }]}
        secondaryCta={{ label: 'Explore products', href: '/products' }}
      />

      {/* The problems, before anything that sells against them. */}
      <section className="border-t border-line-soft bg-ink-2 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
              The challenges
            </span>
            <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
              Three problems every one of these solutions is answering
            </h2>
          </div>

          <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-lg border border-line bg-line">
            {solutionChallenges.map((challenge) => (
              <div
                key={challenge.problem}
                className="grid grid-cols-1 gap-6 bg-ink px-6 py-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-8"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-lg font-medium leading-snug text-text">
                    {challenge.problem}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-2">{challenge.detail}</p>
                </div>
                <div className="flex items-start gap-3 border-t border-line-soft pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-body">{challenge.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use case, then role. */}
      {GROUPS.map((group) => {
        const items = (solutions ?? []).filter((s) => s.group === group.key)
        if (items.length === 0) return null
        const tone = solutionGroupAccent[group.key]

        return (
          <section key={group.key} className="border-t border-line-soft py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className={`text-xs font-medium uppercase tracking-[0.16em] ${toneText[tone]}`}>
                  {group.eyebrow}
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
                      to={`/solutions/${item.slug}`}
                      className="group flex flex-col justify-between gap-6 rounded-lg border border-line bg-ink-2/60 p-6 transition-colors hover:border-brand/40 hover:bg-ink-3"
                    >
                      <div className="flex flex-col gap-4">
                        <GlassIcon icon={Icon} tone={tone} size="sm" />
                        <div className="flex flex-col gap-2">
                          <h3 className="font-display text-base font-medium text-text">{item.name}</h3>
                          <p className="text-sm leading-relaxed text-body">{item.tagline}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-2 text-xs font-medium text-brand">
                        See the solution
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

      {/* The third way in, which the solutions data does not itself hold. */}
      <section className="border-t border-line-soft bg-ink-2 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className={`text-xs font-medium uppercase tracking-[0.16em] ${toneText[INDUSTRY_ACCENT]}`}>
              By sector
            </span>
            <h2 className="mt-3 font-display t-h3 font-medium text-text">
              Start from where you operate
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              The threats differ by sector, and so do the controls that matter. Each page sets out
              what we see against that industry and which products answer it.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = getIcon(industry.icon)
              return (
                <Link
                  key={industry.slug}
                  to={`/industries/${industry.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-line bg-ink/60 p-5 transition-colors hover:border-brand/40 hover:bg-ink-3"
                >
                  <IndustryEmblem slug={industry.slug} icon={Icon} size="menu" />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-medium text-text">{industry.name}</span>
                    <span className="truncate text-xs text-muted-2">{industry.tagline}</span>
                  </span>
                  <ArrowRight
                    className="ml-auto size-4 shrink-0 text-muted-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-line-soft py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Not sure which of these is your problem?"
            highlight="your problem"
            description="Describe what you are defending and what worries you about it. We will tell you which of these applies, and which do not."
          />
        </div>
      </section>
    </>
  )
}
