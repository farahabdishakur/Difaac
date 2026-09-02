import { ShieldAlert, ShieldCheck, Activity, Smartphone } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { ScoreDial } from '@/components/workspace/score-dial'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { useFraudCases, useFraudSummary } from '@/lib/workspace-api'

/**
 * Risk score styling thresholds.
 *
 * The same bands the scoring engine acts on (block at 90, investigate at 70,
 * monitor above 40), so the colour an analyst sees matches the decision the
 * platform already made rather than being a second, unrelated opinion.
 */
function riskClass(score: number): string {
  if (score >= 70) return 'font-semibold text-error'
  if (score >= 40) return 'font-semibold text-warning'
  return 'text-body'
}

export default function FraudPage() {
  const { summary, isLoading: summaryLoading } = useFraudSummary()
  const { cases, error, isLoading } = useFraudCases()

  const mobileShare = summary?.by_channel.find((row) => row.channel === 'mobile')?.count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Fraud Protection</h1>
        <p className="mt-1 text-sm text-body">
          Sessions and transactions scored in real time, and the signals behind each decision.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Scored sessions"
          value={summary?.total_cases ?? 0}
          icon={Activity}
          tone="blue"
          loading={summaryLoading}
        />
        <StatCard
          label="Blocked"
          value={summary?.blocked ?? 0}
          icon={ShieldCheck}
          tone="blue"
          loading={summaryLoading}
        />
        <StatCard
          label="High risk"
          value={summary?.high_risk ?? 0}
          icon={ShieldAlert}
          tone="blue"
          loading={summaryLoading}
        />
        <StatCard
          label="Mobile sessions"
          value={mobileShare}
          icon={Smartphone}
          tone="blue"
          loading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-semibold text-text">Average risk</h2>
          <ScoreDial
            score={Math.round(summary?.average_risk ?? 0)}
            loading={summaryLoading}
            caption="Mean score across every session in the window below, on the same 0-100 scale the engine blocks on."
          />
        </section>

        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-semibold text-text">Detection signals</h2>
          {summary ? (
            <BreakdownBars
              tone="blue"
              items={summary.by_signal.map((row) => ({ label: row.signal, count: row.count }))}
            />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>

        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-semibold text-text">Case outcomes</h2>
          {summary ? (
            <BreakdownBars
              tone="blue"
              items={summary.by_status.map((row) => ({
                label: row.status.replace(/_/g, ' '),
                count: row.count,
              }))}
            />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>
      </div>

      <Panel
        title="Recent fraud cases"
        description="Every scored session, newest first, with the detector that fired."
        loading={isLoading}
        error={error}
        empty={cases.length === 0}
        emptyLabel="No fraud cases flagged yet."
      >
        <DataTable
          rows={cases}
          columns={[
            { header: 'Session', cell: (r) => <span className="font-mono text-text">{r.session_id}</span> },
            { header: 'Risk', cell: (r) => <span className={riskClass(r.risk_score)}>{r.risk_score}</span> },
            { header: 'Signal', cell: (r) => r.signal ?? '—' },
            { header: 'Channel', cell: (r) => <span className="capitalize">{r.channel ?? '—'}</span> },
            { header: 'Origin', cell: (r) => r.country ?? '—' },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status.replace(/_/g, ' ')} /> },
            { header: 'Detected', cell: (r) => new Date(r.detected_at).toLocaleString() },
          ]}
        />
      </Panel>
    </div>
  )
}
