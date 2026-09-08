import { Fingerprint, Gavel, Radar, Timer } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { usePhishingDomains, useDrpSummary } from '@/lib/workspace-api'
import { timeAgo } from '@/lib/time'

/**
 * Digital Risk Protection.
 *
 * Impersonation is not only a domain problem — it shows up on social
 * platforms, marketplaces, and app stores too, so the list covers every
 * channel rather than domains alone.
 *
 * The headline figure is median time to takedown, computed over completed
 * takedowns only. Including the ones still open would make the number improve
 * every time a case stalled, which is exactly backwards.
 */
export default function DigitalRiskPage() {
  const { summary, isLoading: summaryLoading } = useDrpSummary()
  const { domains, error, isLoading } = usePhishingDomains()

  const median = summary?.median_takedown_hours
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Digital Risk Protection</h1>
        <p className="mt-1 text-sm text-body">
          Impersonation of your brand across the open, deep, and dark web — and what has been removed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Items tracked" value={summary?.total_items ?? 0} icon={Radar} tone="rose" loading={summaryLoading} />
        <StatCard label="Taken down" value={summary?.taken_down ?? 0} icon={Gavel} tone="rose" loading={summaryLoading} />
        <StatCard label="High risk" value={summary?.high_risk ?? 0} icon={Fingerprint} tone="rose" loading={summaryLoading} />
        <StatCard
          label="Median takedown"
          value={median === null || median === undefined ? '—' : `${median}h`}
          icon={Timer}
          tone="rose"
          loading={summaryLoading}
        />
      </div>

      <section className="flat-card p-6 lg:p-7">
        <h2 className="mb-5 font-display text-lg font-medium text-text">Where it was found</h2>
        {summary ? (
          <BreakdownBars
            items={summary.by_channel.map((r) => ({ label: r.channel.replace(/-/g, ' '), count: r.count }))}
          />
        ) : (
          <div className="h-24 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
        )}
      </section>

      <Panel
        title="Brand abuse"
        description="Every impersonation found against your brand, newest first."
        loading={isLoading}
        error={error}
        empty={domains.length === 0}
        emptyLabel="Nothing found against your brand yet."
      >
        <DataTable
          rows={domains}
          columns={[
            { header: 'Item', cell: (r) => <span className="font-mono text-text">{r.domain}</span> },
            { header: 'Channel', cell: (r) => <span className="capitalize">{(r.channel ?? '—').replace(/-/g, ' ')}</span> },
            { header: 'Risk', cell: (r) => (r.risk ? <SeverityBadge value={r.risk} /> : '—') },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status.replace(/_/g, ' ')} /> },
            { header: 'Found', cell: (r) => timeAgo(r.discovered_at) },
            { header: 'Removed', cell: (r) => (r.takedown_at ? timeAgo(r.takedown_at) : '—') },
          ]}
        />
      </Panel>
    </div>
  )
}
