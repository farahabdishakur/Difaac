import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { commitments, principles, founding } from '@/lib/data/company'

/**
 * The homepage's credibility section.
 *
 * Sites in this category fill this slot with historical proof — investigations
 * closed, losses prevented, agency partnerships, analyst rankings. Difaac has
 * been operating since April 2026 and has none of that yet, and inventing it
 * would put false statements in front of people evaluating a security vendor.
 *
 * So this section makes the trade the rest of the site already makes (see the
 * note at the top of `lib/data/company.ts`): it states how the platform is
 * operated and what it commits to, which is true and checkable from the first
 * day of a contract, and it says plainly how new the company is instead of
 * implying otherwise.
 */
export function PlatformCommitments() {
  // The three principles that describe the operating model rather than the
  // contractual terms — the rest are on the company page, where a reader who
  // wants the full list has gone looking for it.
  const shown = principles.slice(0, 3)

  return (
    <section className="border-t border-line-soft bg-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-balance font-display t-h2 font-medium leading-[1.15] text-text">
              What we will hold ourselves to
            </h2>
            <p className="mt-6 max-w-lg text-pretty leading-relaxed text-body">
              Difaac has been operating since {founding.founded}, so we are not going to point at a
              decade of case files. What we can put in writing is how the platform runs and what
              every engagement commits to — the things a customer can hold us to from day one.
            </p>

            <Link
              to="/company"
              className="tap-target group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-bright"
            >
              How Difaac works
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {commitments.map((commitment) => (
                <div key={commitment.label} className="flex flex-col gap-1.5 border-l-2 border-brand/40 pl-4">
                  <span className="font-display text-xl font-medium tracking-tight text-brand">
                    {commitment.value}
                  </span>
                  <span className="text-sm font-medium text-text">{commitment.label}</span>
                  <span className="text-sm leading-relaxed text-muted-2">{commitment.detail}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 border-t border-line-soft pt-8 sm:grid-cols-3">
              {shown.map((principle) => {
                const Icon = getIcon(principle.icon)
                return (
                  <div key={principle.title} className="flex flex-col gap-2.5">
                    <Icon className="size-5 text-brand" aria-hidden="true" strokeWidth={1.6} />
                    <span className="text-sm font-medium text-text">{principle.title}</span>
                    <span className="text-xs leading-relaxed text-muted-2">{principle.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
