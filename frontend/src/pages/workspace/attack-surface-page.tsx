import { Globe, EyeOff, ShieldAlert, Wrench } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { StatCard } from '@/components/workspace/stat-card'
import { ScoreDial } from '@/components/workspace/score-dial'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { useAsmAssets, useAsmSummary } from '@/lib/workspace-api'
import { timeAgo } from '@/lib/time'

/**
 * Attack Surface Management.
 *
 * The list is ordered by exposure rather than by discovery date, because the
 * question this page is opened with is "what do we fix next", not "what
 * turned up last". Shadow IT gets its own figure for the same reason: an
 * asset nobody declared is the one most likely to be unpatched, and burying
 * it in a total would lose that.
 */
function exposureClass(score: number): string {
  if (score >= 70) return 'font-medium text-error'
  if (score >= 40) return 'font-medium text-warning'
  return 'text-body'
}

export default function AttackSurfacePage() {
  const { summary, isLoading: summaryLoading } = useAsmSummary()
  const { assets, error, isLoading } = useAsmAssets()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Attack Surface Management</h1>
        <p className="mt-1 text-sm text-body">
          Everything of yours that answers from the internet, including what nobody remembers deploying.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active assets" value={summary?.total_assets ?? 0} icon={Globe} tone="cyan" loading={summaryLoading} />
        <StatCard label="Shadow IT" value={summary?.shadow_it ?? 0} icon={EyeOff} tone="cyan" loading={summaryLoading} />
        <StatCard label="Critical exposure" value={summary?.critical_exposures ?? 0} icon={ShieldAlert} tone="cyan" loading={summaryLoading} />
        <StatCard label="Open issues" value={summary?.assets_with_issues ?? 0} icon={Wrench} tone="cyan" loading={summaryLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">Average exposure</h2>
          <ScoreDial
            score={Math.round(summary?.average_exposure ?? 0)}
            loading={summaryLoading}
            caption="Mean exposure score across every active asset, as scored by the discovery run."
          />
        </section>

        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">Assets by type</h2>
          {summary ? (
            <BreakdownBars
              tone="blue"
              items={summary.by_type.map((r) => ({ label: r.asset_type, count: r.count }))}
            />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>
      </div>

      <Panel
        title="Discovered assets"
        description="Most exposed first. Work the list from the top."
        loading={isLoading}
        error={error}
        empty={assets.length === 0}
        emptyLabel="No assets discovered yet."
      >
        <DataTable
          rows={assets}
          columns={[
            {
              header: 'Host',
              cell: (r) => (
                <span className="flex items-center gap-2">
                  <span className="font-mono text-text">{r.host}</span>
                  {r.is_shadow_it ? (
                    <span className="rounded-[3px] border border-warning/40 bg-warning/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-warning">
                      Shadow
                    </span>
                  ) : null}
                </span>
              ),
            },
            { header: 'Type', cell: (r) => <span className="capitalize">{r.asset_type}</span> },
            { header: 'Service', cell: (r) => (r.port ? `${r.service ?? '—'}:${r.port}` : r.service ?? '—') },
            { header: 'Exposure', cell: (r) => <span className={exposureClass(r.exposure_score)}>{r.exposure_score}</span> },
            { header: 'Issue', cell: (r) => <span className="line-clamp-2 max-w-xs">{r.issue ?? '—'}</span> },
            { header: 'Found', cell: (r) => timeAgo(r.discovered_at) },
          ]}
        />
      </Panel>
    </div>
  )
}
