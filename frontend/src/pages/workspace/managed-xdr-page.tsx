import { Activity, ShieldCheck, Siren, Layers } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { useXdrDetections, useXdrSummary, useIncidents } from '@/lib/workspace-api'
import { formatDateTime, timeAgo } from '@/lib/time'

/**
 * Managed XDR.
 *
 * The page answers the two questions an analyst opens it with: what fired
 * across the estate, and what has already been dealt with. Detections and
 * incidents are shown separately on purpose — a detection is what a rule
 * matched, an incident is what someone opened after confirming one, and
 * collapsing them would hide the ratio the SOC is actually judged on.
 */
export default function ManagedXdrPage() {
  const { summary, isLoading: summaryLoading } = useXdrSummary()
  const { detections, error, isLoading } = useXdrDetections(25)
  const { incidents, error: incidentsError, isLoading: incidentsLoading } = useIncidents(10)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Managed XDR</h1>
        <p className="mt-1 text-sm text-body">
          Endpoint, network, email, and cloud in one timeline, triaged by the analysts who run it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Detections" value={summary?.total_detections ?? 0} icon={Activity} loading={summaryLoading} />
        <StatCard label="Awaiting triage" value={summary?.open ?? 0} icon={Siren} loading={summaryLoading} />
        <StatCard label="Contained" value={summary?.contained ?? 0} icon={ShieldCheck} loading={summaryLoading} />
        <StatCard label="High severity" value={summary?.high_severity ?? 0} icon={Layers} loading={summaryLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">Detections by layer</h2>
          {summary ? (
            <BreakdownBars items={summary.by_layer.map((r) => ({ label: r.layer, count: r.count }))} />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>

        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">By severity</h2>
          {summary ? (
            <BreakdownBars items={summary.by_severity.map((r) => ({ label: r.severity, count: r.count }))} />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>
      </div>

      <Panel
        title="Detections"
        description="Every rule that fired, newest first, with the ATT&CK technique it maps to."
        loading={isLoading}
        error={error}
        empty={detections.length === 0}
        emptyLabel="Nothing has fired yet."
      >
        <DataTable
          rows={detections}
          columns={[
            { header: 'Rule', cell: (r) => <span className="font-medium text-text">{r.rule}</span> },
            { header: 'Layer', cell: (r) => <span className="capitalize">{r.layer}</span> },
            { header: 'Severity', cell: (r) => <SeverityBadge value={r.severity} /> },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Host', cell: (r) => <span className="font-mono text-xs">{r.host ?? '—'}</span> },
            { header: 'Technique', cell: (r) => <span className="font-mono text-xs">{r.technique ?? '—'}</span> },
            { header: 'Detected', cell: (r) => timeAgo(r.detected_at) },
          ]}
        />
      </Panel>

      <Panel
        title="Incidents opened"
        description="Detections an analyst confirmed and escalated into a case."
        loading={incidentsLoading}
        error={incidentsError}
        empty={incidents.length === 0}
        emptyLabel="No incidents opened."
      >
        <DataTable
          rows={incidents}
          columns={[
            { header: 'Title', cell: (r) => <span className="font-medium text-text">{r.title}</span> },
            { header: 'Severity', cell: (r) => <SeverityBadge value={r.severity} /> },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Reported by', cell: (r) => r.reported_by ?? '—' },
            { header: 'Opened', cell: (r) => formatDateTime(r.created_at) },
          ]}
        />
      </Panel>
    </div>
  )
}
