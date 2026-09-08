import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useIncidents } from '@/lib/workspace-api'

export default function IncidentsPage() {
  const { incidents, error, isLoading } = useIncidents()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Incidents</h1>
        <p className="mt-1 text-sm text-body">Open and recently closed security incidents.</p>
      </div>

      <Panel
        title="All Incidents"
        loading={isLoading}
        error={error}
        empty={incidents.length === 0}
        emptyLabel="No incidents reported."
      >
        <DataTable
          rows={incidents}
          columns={[
            { header: 'Title', cell: (r) => <span className="font-medium text-text">{r.title}</span> },
            { header: 'Severity', cell: (r) => <SeverityBadge value={r.severity} /> },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Reported By', cell: (r) => r.reported_by ?? '—' },
            { header: 'Created', cell: (r) => new Date(r.created_at).toLocaleString() },
          ]}
        />
      </Panel>
    </div>
  )
}
