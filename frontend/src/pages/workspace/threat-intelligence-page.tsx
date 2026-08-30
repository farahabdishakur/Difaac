import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useIocs, useThreatActors } from '@/lib/workspace-api'

export default function ThreatIntelligencePage() {
  const { iocs, error: iocsError, isLoading: iocsLoading } = useIocs()
  const { actors, error: actorsError, isLoading: actorsLoading } = useThreatActors()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Threat Intelligence</h1>
        <p className="mt-1 text-sm text-body">Indicators of compromise and tracked actor groups.</p>
      </div>

      <Panel
        title="Indicators of Compromise"
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
            { header: 'Observed', cell: (r) => new Date(r.created_at).toLocaleString() },
          ]}
        />
      </Panel>

      <Panel
        title="Tracked Actor Groups"
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
