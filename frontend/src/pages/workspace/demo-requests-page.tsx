import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useDemoRequests } from '@/lib/demo-requests'

export default function DemoRequestsPage() {
  const { requests, error, isLoading } = useDemoRequests()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Demo Requests</h1>
        <p className="mt-1 text-sm text-body">
          Submissions from the "Request a demo" form on the product pages. No email is sent — this
          list is the queue.
        </p>
      </div>

      <Panel
        title="All Requests"
        loading={isLoading}
        error={error}
        empty={requests.length === 0}
        emptyLabel="No demo requests yet."
      >
        <DataTable
          rows={requests}
          columns={[
            { header: 'Name', cell: (r) => <span className="font-medium text-text">{r.name}</span> },
            { header: 'Company', cell: (r) => r.company },
            {
              header: 'Email',
              cell: (r) => (
                <a href={`mailto:${r.email}`} className="font-mono text-brand hover:underline">
                  {r.email}
                </a>
              ),
            },
            { header: 'Role', cell: (r) => r.role },
            { header: 'Product', cell: (r) => <span className="font-mono text-xs">{r.product_slug}</span> },
            { header: 'Status', cell: (r) => <SeverityBadge value={r.status} /> },
            { header: 'Received', cell: (r) => new Date(r.created_at).toLocaleString() },
          ]}
        />
      </Panel>
    </div>
  )
}
