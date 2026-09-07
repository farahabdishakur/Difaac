import { useState } from 'react'
import { Radar, Users, Fingerprint, ShieldAlert } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { ScoreDial } from '@/components/workspace/score-dial'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { useIocs, useThreatActors, useTiAlerts, useTiSummary } from '@/lib/workspace-api'
import { formatDateTime, timeAgo } from '@/lib/time'

function AlertRow({
  title,
  category,
  severity,
  source,
  actor,
  tailored,
  detectedAt,
}: {
  title: string
  category: string
  severity: string
  source: string
  actor: string | null
  tailored: boolean
  detectedAt: string
}) {
  return (
    <li className="flex flex-col gap-2.5 border-b border-line-soft py-4 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium leading-snug text-text">{title}</span>
        <span className="shrink-0 font-mono text-xs text-muted-2">{timeAgo(detectedAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge value={severity} />
        <span className="rounded-[3px] border border-line bg-ink-3 px-2 py-0.5 text-[11px] capitalize text-muted-2">
          {category}
        </span>
        {actor ? (
          <span className="rounded-[3px] border border-accent-violet/40 bg-accent-violet/10 px-2 py-0.5 text-[11px] text-accent-violet">
            {actor}
          </span>
        ) : null}
        {tailored ? (
          <span className="rounded-[3px] border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] text-brand">
            Tailored
          </span>
        ) : null}
        <span className="text-[11px] text-muted-2">{source}</span>
      </div>
    </li>
  )
}

export default function ThreatIntelligencePage() {
  const [tailoredOnly, setTailoredOnly] = useState(false)

  const { summary, isLoading: summaryLoading } = useTiSummary()
  const { alerts, error: alertsError, isLoading: alertsLoading } = useTiAlerts({ limit: 25, tailoredOnly })
  const { iocs, error: iocsError, isLoading: iocsLoading } = useIocs()
  const { actors, error: actorsError, isLoading: actorsLoading } = useThreatActors()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Threat Intelligence</h1>
        <p className="mt-1 text-sm text-body">
          Adversary activity tracked against your organisation, its brand, and its sector.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open alerts"
          value={summary?.total_alerts ?? 0}
          icon={ShieldAlert}
          tone="violet"
          loading={summaryLoading}
        />
        <StatCard
          label="Tailored to you"
          value={summary?.tailored_alerts ?? 0}
          icon={Fingerprint}
          tone="violet"
          loading={summaryLoading}
        />
        <StatCard
          label="Indicators of compromise"
          value={summary?.total_iocs ?? 0}
          icon={Radar}
          tone="violet"
          loading={summaryLoading}
        />
        <StatCard
          label="Tracked actors"
          value={summary?.total_actors ?? 0}
          icon={Users}
          tone="violet"
          loading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Threats and alerts"
          description="Newest first. Filter to the alerts raised against your own assets and brand."
          loading={alertsLoading}
          error={alertsError}
          empty={alerts.length === 0}
          emptyLabel={tailoredOnly ? 'No tailored alerts right now.' : 'No alerts collected yet.'}
          action={
            <div className="flex gap-1 rounded-[4px] border border-line p-0.5">
              {[
                { label: 'All', value: false },
                { label: 'Tailored', value: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setTailoredOnly(option.value)}
                  aria-pressed={tailoredOnly === option.value}
                  className={`rounded-[3px] px-3 py-1 text-xs font-medium transition-colors ${
                    tailoredOnly === option.value
                      ? 'bg-accent-violet/15 text-accent-violet'
                      : 'text-muted-2 hover:text-body'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          }
        >
          <ul className="flex flex-col">
            {alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                title={alert.title}
                category={alert.category}
                severity={alert.severity}
                source={alert.source}
                actor={alert.actor}
                tailored={alert.is_tailored}
                detectedAt={alert.detected_at}
              />
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <section className="flat-card p-6 lg:p-7">
            <h2 className="mb-5 font-display text-lg font-semibold text-text">Your exposure</h2>
            <ScoreDial
              score={summary?.exposure_score ?? 0}
              loading={summaryLoading}
              caption="Severity-weighted average of every open alert, scored against an all-critical feed."
            />
            {summary ? (
              <div className="mt-6 border-t border-line-soft pt-5">
                <BreakdownBars
                  tone="violet"
                  items={['critical', 'high', 'medium', 'low'].map((severity) => ({
                    label: severity,
                    count: summary.severity_counts[severity] ?? 0,
                  }))}
                />
              </div>
            ) : null}
          </section>

          {summary && summary.category_counts.length > 0 ? (
            <section className="flat-card p-6 lg:p-7">
              <h2 className="mb-5 font-display text-lg font-semibold text-text">Alerts by category</h2>
              <BreakdownBars
                tone="violet"
                items={summary.category_counts.map((row) => ({
                  label: row.category.replace('-', ' '),
                  count: row.count,
                }))}
              />
            </section>
          ) : null}
        </div>
      </div>

      <Panel
        title="Indicators of compromise"
        description="Machine-matchable artefacts ready to push into your detection tooling."
        loading={iocsLoading}
        error={iocsError}
        empty={iocs.length === 0}
        emptyLabel="No indicators collected yet."
      >
        <DataTable
          rows={iocs}
          columns={[
            { header: 'Value', cell: (r) => <span className="font-mono text-text">{r.value}</span> },
            { header: 'Type', cell: (r) => r.type },
            { header: 'Severity', cell: (r) => <SeverityBadge value={r.severity} /> },
            { header: 'Source', cell: (r) => r.source },
            { header: 'Observed', cell: (r) => formatDateTime(r.created_at) },
          ]}
        />
      </Panel>

      <Panel
        title="Tracked actor groups"
        description="Groups whose tooling and infrastructure are followed on your behalf."
        loading={actorsLoading}
        error={actorsError}
        empty={actors.length === 0}
        emptyLabel="No actor groups tracked yet."
      >
        <DataTable
          rows={actors}
          columns={[
            { header: 'Name', cell: (r) => <span className="font-medium text-text">{r.name}</span> },
            { header: 'Aliases', cell: (r) => r.aliases ?? '—' },
            { header: 'Origin', cell: (r) => r.origin ?? '—' },
            { header: 'Description', cell: (r) => <span className="line-clamp-2 max-w-md">{r.description}</span> },
          ]}
        />
      </Panel>
    </div>
  )
}
