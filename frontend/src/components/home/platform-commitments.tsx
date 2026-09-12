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
 *
 * Presented as a centred header over a metric grid and two operating
 * principles — cards rather than a two-column list, so the commitments read as
 * the deliberate, equal set they are.
 */
export function PlatformCommitments() {
  // The two principles that describe the operating model itself; the full set
  // of contractual terms lives on the company page.
  const shown = principles.slice(0, 2)

  return (
    <section className="border-t border-line-soft bg-ink-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Our commitments
          </span>
          <h2 className="mt-4 text-balance font-display t-h2 font-medium leading-[1.15] text-text">
            What we hold ourselves to
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-body">
            Difaac has been operating since {founding.founded}, so we do not point at a decade of
            case files. What we put in writing is how the platform runs and what every engagement
            commits to — the things a customer can hold us to from day one.
          </p>
        </div>

        {/* Metric grid — the service commitments */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {commitments.map((commitment) => (
            <div
              key={commitment.label}
              className="group relative overflow-hidden rounded-2xl border border-line-soft bg-ink/50 p-6 transition-colors duration-200 hover:border-brand/40"
            >
              {/* A hairline of accent along the top, brightening on hover — the
                  one flourish, so the card reads as considered rather than plain. */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="font-display text-2xl font-medium tracking-tight text-brand lg:text-[1.75rem]">
                {commitment.value}
              </div>
              <div className="mt-3 text-sm font-semibold text-text">{commitment.label}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-2">{commitment.detail}</p>
            </div>
          ))}
        </div>

        {/* The operating principles behind the numbers */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {shown.map((principle) => {
            const Icon = getIcon(principle.icon)
            return (
              <div
                key={principle.title}
                className="rounded-2xl border border-line-soft bg-ink/50 p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" aria-hidden="true" strokeWidth={1.7} />
                  </span>
                  <h3 className="font-display text-lg font-medium text-text">{principle.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-body">{principle.description}</p>
              </div>
            )
          })}
        </div>

        {/* Link to the full account */}
        <div className="mt-12 text-center">
          <Link
            to="/company"
            className="tap-target group inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-bright"
          >
            How Difaac works
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
