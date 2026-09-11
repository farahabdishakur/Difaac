import { useMemo, useState } from 'react'
import { FileClock, CheckCircle2, ShieldX, AlertTriangle } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { useAppEvents } from '@/lib/workspace-api'

/**
 * The record-access trail — the security-relevant events a customer's own
 * application reports to Difaac.
 *
 * This is the console that makes the healthcare story concrete: a hospital's
 * record system posts an event every time a record is opened, exported, or a
 * sign-in fails, and this page is where "who touched this patient's file, and
 * when" is answered. It reads `/api/app-events`, which is isolated to the
 * signed-in tenant by row-level security and gated on `audit:read` — narrower
 * than the rest of the console, because this stream is the most sensitive
 * thing Difaac holds for that customer.
 *
 * `subject_ref` is shown as the identifier it is; the integration contract
 * forbids sending a patient's name, so none is ever here to display.
 */

// The outcomes the backend validates against, plus "All". A segmented filter
// rather than free text: the vocabulary is closed, so the control should be.
const OUTCOMES = ['All', 'success', 'failure', 'denied', 'error'] as const
type OutcomeFilter = (typeof OUTCOMES)[number]

export default function RecordAccessPage() {
  const [outcome, setOutcome] = useState<OutcomeFilter>('All')
  const { events, error, isLoading } = useAppEvents(outcome === 'All' ? undefined : outcome)

  // Counts for the summary strip, taken from the rows already fetched so the
  // tiles always agree with the table below them rather than a second query
  // that could drift out of step.
  const summary = useMemo(() => {
    const denied = events.filter((e) => e.outcome === 'denied' || e.outcome === 'failure').length
    const critical = events.filter((e) => /critical|high/i.test(e.severity)).length
    const success = events.filter((e) => e.outcome === 'success').length
    return { total: events.length, success, denied, critical }
  }, [events])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Record Access</h1>
        <p className="mt-1 text-sm text-body">
          Every security-relevant action your connected systems report — who did it, to which
          record, and when. Isolated to your organisation and visible only to administrators.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Events" value={summary.total} icon={FileClock} tone="brand" loading={isLoading} />
        <StatCard label="Successful" value={summary.success} icon={CheckCircle2} tone="brand" loading={isLoading} />
        <StatCard label="Denied / Failed" value={summary.denied} icon={ShieldX} tone="fuchsia" loading={isLoading} />
        <StatCard label="High / Critical" value={summary.critical} icon={AlertTriangle} tone="rose" loading={isLoading} />
      </div>

      <Panel
        title="Access trail"
        description="The most recent events, newest first."
        loading={isLoading}
        error={error}
        empty={events.length === 0}
        emptyLabel="No events reported yet. Once a connected application starts sending events, they appear here."
        action={
          <div className="flex flex-wrap gap-1 rounded-[6px] border border-line-soft bg-ink-2 p-1">
            {OUTCOMES.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOutcome(o)}
                className={`rounded-[4px] px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  outcome === o ? 'bg-brand text-brand-ink' : 'text-muted-2 hover:text-text'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        }
      >
        <DataTable
          rows={events}
          columns={[
            {
              header: 'When',
              cell: (r) => (
                <span className="whitespace-nowrap text-body">
                  {new Date(r.occurred_at).toLocaleString()}
                </span>
              ),
            },
            { header: 'Action', cell: (r) => <span className="font-medium text-text">{r.action}</span> },
            { header: 'Outcome', cell: (r) => <SeverityBadge value={r.outcome} /> },
            { header: 'Severity', cell: (r) => <SeverityBadge value={r.severity} /> },
            { header: 'Actor', cell: (r) => r.actor ?? '—' },
            {
              header: 'Record',
              cell: (r) =>
                r.subject_ref ? (
                  <code className="rounded-[3px] bg-ink-3 px-1.5 py-0.5 text-xs text-body">
                    {r.subject_ref}
                  </code>
                ) : (
                  '—'
                ),
            },
            { header: 'Source', cell: (r) => <span className="text-muted-2">{r.source}</span> },
            { header: 'IP', cell: (r) => <span className="text-muted-2">{r.ip_address ?? '—'}</span> },
          ]}
        />
      </Panel>
    </div>
  )
}
