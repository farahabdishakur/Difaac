import { Mail, ShieldCheck, FileWarning, UserX } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { DataTable } from '@/components/workspace/data-table'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { StatCard } from '@/components/workspace/stat-card'
import { BreakdownBars } from '@/components/workspace/breakdown-bars'
import { useBepMessages, useBepSummary } from '@/lib/workspace-api'
import { timeAgo } from '@/lib/time'

/**
 * Threat types read back as prose, not as their stored keys.
 *
 * A blanket `capitalize` turns "bec" into "Bec", which is wrong — it is an
 * acronym. Mapping the ones that matter is a few lines and reads correctly;
 * anything unmapped falls back to the generic treatment.
 */
const THREAT_LABEL: Record<string, string> = {
  bec: 'BEC',
  phishing: 'Phishing',
  malware: 'Malware',
  'credential-harvest': 'Credential harvesting',
}

function threatLabel(value: string): string {
  return THREAT_LABEL[value] ?? value.replace(/-/g, ' ')
}

/**
 * Business Email Protection.
 *
 * Payload-free attacks get their own figure at the top. Detonation catches
 * attachments and links; invoice fraud and executive impersonation carry
 * nothing to detonate and are caught on language and context instead. A
 * dashboard that reported one number for "threats stopped" would hide which
 * of the two halves is actually doing the work.
 */
export default function EmailProtectionPage() {
  const { summary, isLoading: summaryLoading } = useBepSummary()
  const { messages, error, isLoading } = useBepMessages(25)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-text">Business Email Protection</h1>
        <p className="mt-1 text-sm text-body">
          What the gateway acted on before it reached a mailbox, and why.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Messages actioned" value={summary?.total_messages ?? 0} icon={Mail} tone="fuchsia" loading={summaryLoading} />
        <StatCard label="Stopped" value={summary?.stopped ?? 0} icon={ShieldCheck} tone="fuchsia" loading={summaryLoading} />
        <StatCard label="Payload-free" value={summary?.payload_free ?? 0} icon={FileWarning} tone="fuchsia" loading={summaryLoading} />
        <StatCard label="Impersonation" value={summary?.bec ?? 0} icon={UserX} tone="fuchsia" loading={summaryLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">By threat type</h2>
          {summary ? (
            <BreakdownBars
              items={summary.by_threat_type.map((r) => ({
                label: threatLabel(r.threat_type),
                count: r.count,
              }))}
            />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>

        <section className="flat-card p-6 lg:p-7">
          <h2 className="mb-5 font-display text-lg font-medium text-text">Verdicts</h2>
          {summary ? (
            <BreakdownBars items={summary.by_verdict.map((r) => ({ label: r.verdict, count: r.count }))} />
          ) : (
            <div className="h-32 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
          )}
        </section>
      </div>

      <Panel
        title="Recent messages"
        description="Newest first. Payload-free entries carried no attachment or link to detonate."
        loading={isLoading}
        error={error}
        empty={messages.length === 0}
        emptyLabel="Nothing actioned yet."
      >
        <DataTable
          rows={messages}
          columns={[
            {
              header: 'Subject',
              cell: (r) => (
                <span className="flex flex-col gap-0.5">
                  <span className="line-clamp-1 max-w-xs font-medium text-text">{r.subject}</span>
                  <span className="font-mono text-[11px] text-muted-2">{r.sender}</span>
                </span>
              ),
            },
            { header: 'To', cell: (r) => <span className="font-mono text-xs">{r.recipient}</span> },
            { header: 'Type', cell: (r) => threatLabel(r.threat_type) },
            {
              header: 'Payload',
              cell: (r) => (r.has_payload ? 'Attachment / link' : 'None'),
            },
            { header: 'Confidence', cell: (r) => `${r.confidence}%` },
            { header: 'Verdict', cell: (r) => <SeverityBadge value={r.verdict} /> },
            { header: 'Detected', cell: (r) => timeAgo(r.detected_at) },
          ]}
        />
      </Panel>
    </div>
  )
}
