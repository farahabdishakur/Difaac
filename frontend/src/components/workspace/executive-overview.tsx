import { Link } from 'react-router-dom'
import { ArrowRight, ShieldAlert, Siren, Globe, Fingerprint } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { StatCard } from '@/components/workspace/stat-card'
import { ScoreDial } from '@/components/workspace/score-dial'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { formatDateTime } from '@/lib/time'
import { ActivityTrend } from '@/components/workspace/activity-trend'
import { useExecutiveOverview, useActivityTrend } from '@/lib/workspace-api'

/**
 * The overview a manager or administrator sees.
 *
 * An analyst opens the platform holding a queue; someone accountable for the
 * organisation opens it holding a question — how bad is it, and what needs a
 * decision today. So this leads with one posture figure and a sentence
 * stating the position in words, then the counts behind it, then the events
 * that would change a plan.
 *
 * Every figure is a live count from the same tables the consoles read, and
 * every card links into the console that owns it, so a number here is always
 * one click from the rows that produced it.
 */

function postureSentence(critical: number, incidents: number): string {
  if (critical === 0 && incidents === 0) {
    return 'Nothing critical is open. The estate is quiet.'
  }
  const parts: string[] = []
  if (critical > 0) {
    parts.push(`${critical} critical threat${critical === 1 ? '' : 's'}`)
  }
  if (incidents > 0) {
    parts.push(`${incidents} open incident${incidents === 1 ? '' : 's'}`)
  }
  return `Your organisation currently has ${parts.join(' and ')} requiring attention.`
}

export function ExecutiveOverview({ name }: { name: string }) {
  const { overview, error, isLoading } = useExecutiveOverview()
  const { trend, isLoading: trendLoading } = useActivityTrend(14)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">
          Security posture{name ? `, ${name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-body">
          Where the organisation stands right now, across every product you run.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.7fr]">
        <section className="flat-card flex flex-col justify-between p-6 lg:p-7">
          <div>
            <h2 className="mb-5 font-display text-lg font-medium text-text">Overall posture</h2>
            <ScoreDial
              score={overview?.posture_score ?? 0}
              loading={isLoading}
              caption="Weighted across critical threats, open incidents, asset exposure, brand abuse, and fraud risk."
            />
          </div>

          <p className="mt-6 border-t border-line-soft pt-5 text-sm leading-relaxed text-body">
            {overview
              ? postureSentence(overview.critical_threats, overview.open_incidents)
              : 'Reading the current position…'}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Critical threats"
            value={overview?.critical_threats ?? 0}
            icon={ShieldAlert}
            tone="rose"
            loading={isLoading}
          />
          <StatCard
            label="Open incidents"
            value={overview?.open_incidents ?? 0}
            icon={Siren}
            tone="rose"
            loading={isLoading}
          />
          <StatCard
            label="Exposed assets"
            value={
              overview ? `${overview.exposed_assets} / ${overview.total_assets}` : 0
            }
            icon={Globe}
            tone="cyan"
            loading={isLoading}
          />
          <StatCard
            label="Live brand abuse"
            value={overview?.live_brand_abuse ?? 0}
            icon={Fingerprint}
            tone="rose"
            loading={isLoading}
          />

          {/* The decisions this page exists to prompt. Each goes to the console
              that can actually action it rather than to a modal here. */}
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Link
              to="/workspace/managed-xdr"
              className="inline-flex items-center gap-2 rounded-[4px] border border-brand bg-brand px-4 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-bright"
            >
              Review critical threats
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/workspace/incidents"
              className="inline-flex items-center gap-2 rounded-[4px] border border-line-soft px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-brand/50 hover:text-brand"
            >
              Open incidents
            </Link>
            <Link
              to="/workspace/attack-surface"
              className="inline-flex items-center gap-2 rounded-[4px] border border-line-soft px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-brand/50 hover:text-brand"
            >
              Close exposure
            </Link>
          </div>
        </div>
      </div>

      <section className="flat-card p-6 lg:p-7">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-medium text-text">Security events per day</h2>
          <span className="text-xs text-muted-2">
            {trend ? `${trend.total} in the last ${trend.days} days` : ''}
          </span>
        </div>
        <ActivityTrend series={trend?.series ?? []} loading={trendLoading} />
      </section>

      <Panel
        title="Recent critical activity"
        description="The highest-severity events across intelligence, detection, and incidents — newest first."
        loading={isLoading}
        error={error}
        empty={!overview || overview.critical_events.length === 0}
        emptyLabel="Nothing at critical or high severity."
      >
        <ul className="flex flex-col divide-y divide-line-soft">
          {overview?.critical_events.map((event) => (
            <li
              key={`${event.source}-${event.occurred_at}-${event.title}`}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-text">{event.title}</span>
                <span className="text-xs text-muted-2">
                  {event.source} · {formatDateTime(event.occurred_at)}
                </span>
              </div>
              <SeverityBadge value={event.severity} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
