import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { usePhishingDomains } from '@/lib/workspace-api'

export default function DigitalRiskPage() {
  const { domains, error, isLoading } = usePhishingDomains()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">Digital Risk Protection</h1>
        <p className="mt-1 text-sm text-body">Phishing domains detected against your brand.</p>
      </div>

      <Panel
        title="Phishing Domains"
        loading={isLoading}
        error={error}
        empty={domains.length === 0}
        emptyLabel="No phishing domains detected yet."
      >
        <DataTable
          rows={domains}
          columns={[
            { header: 'Domain', cell: (r) => <span className="font-mono text-text">{r.domain}</span> },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Discovered', cell: (r) => new Date(r.discovered_at).toLocaleString() },
          ]}
        />
      </Panel>
    </div>
  )
}
