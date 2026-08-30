import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useFraudCases } from '@/lib/workspace-api'

export default function FraudPage() {
  const { cases, error, isLoading } = useFraudCases()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Fraud Cases</h1>
        <p className="mt-1 text-sm text-body">Sessions and transactions flagged by real-time fraud scoring.</p>
      </div>

      <Panel
        title="Recent Fraud Cases"
        loading={isLoading}
        error={error}
        empty={cases.length === 0}
        emptyLabel="No fraud cases flagged yet."
      >
        <DataTable
          rows={cases}
          columns={[
            { header: 'Session', cell: (r) => <span className="font-mono text-text">{r.session_id}</span> },
            {
              header: 'Risk Score',
              cell: (r) => (
                <span className={r.risk_score >= 70 ? 'font-semibold text-error' : r.risk_score >= 40 ? 'font-semibold text-warning' : 'text-body'}>
                  {r.risk_score}
                </span>
              ),
            },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Detected', cell: (r) => new Date(r.detected_at).toLocaleString() },
          ]}
        />
      </Panel>
    </div>
  )
}
