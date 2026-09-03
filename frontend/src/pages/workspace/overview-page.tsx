import { Link } from 'react-router-dom'
import { ArrowRight, Radar, ShieldAlert, Activity, Globe, Fingerprint, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Panel } from '@/components/workspace/panel'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useAuthUser } from '@/hooks/use-auth'
import { toneChip } from '@/lib/tone'
import type { Tone } from '@/lib/tone'
import { formatDateTime } from '@/lib/time'
import {
  useTiSummary,
  useFraudSummary,
  useXdrSummary,
  useAsmSummary,
  useDrpSummary,
  useBepSummary,
  useIncidents,
} from '@/lib/workspace-api'

/**
 * Workspace overview.
 *
 * One card per product, each showing the single figure that would make an
 * analyst open that console — not a total. "12 assets" says nothing; "6
 * shadow IT" is a reason to click. Every card links straight through, so this
 * page is a triage surface rather than a summary to read and leave.
 */
function ProductCard({
  to,
  name,
  icon: Icon,
  tone,
  value,
  label,
  loading,
}: {
  to: string
  name: string
  icon: LucideIcon
  tone: Tone
  value: number | string
  label: string
  loading: boolean
}) {
  return (
    <Link
      to={to}
      className="group flat-card flex flex-col gap-4 p-5 transition-colors hover:border-brand/40"
    >
      <div className="flex items-center justify-between">
        <span className={`flex size-10 items-center justify-center rounded-[4px] ${toneChip[tone]}`}>
          <Icon className="size-5" aria-hidden="true" strokeWidth={1.8} />
        </span>
        <ArrowRight
          className="size-4 text-muted-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">{name}</span>
        <span className="font-display text-2xl font-semibold tracking-tight text-text">
          {loading ? '—' : value}
        </span>
        <span className="text-xs text-muted-2">{label}</span>
      </div>
    </Link>
  )
}

export default function OverviewPage() {
  const user = useAuthUser()
  const ti = useTiSummary()
  const fraud = useFraudSummary()
  const xdr = useXdrSummary()
  const asm = useAsmSummary()
  const drp = useDrpSummary()
  const bep = useBepSummary()
  const { incidents, error: incidentsError, isLoading: incidentsLoading } = useIncidents(5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">
          Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-body">
          What each part of the platform is holding for you right now.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ProductCard
          to="/workspace/threat-intelligence"
          name="Threat Intelligence"
          icon={Radar}
          tone="violet"
          value={ti.summary?.tailored_alerts ?? 0}
          label="alerts raised against you"
          loading={ti.isLoading}
        />
        <ProductCard
          to="/workspace/fraud"
          name="Fraud Protection"
          icon={ShieldAlert}
          tone="blue"
          value={fraud.summary?.high_risk ?? 0}
          label="sessions scored high risk"
          loading={fraud.isLoading}
        />
        <ProductCard
          to="/workspace/managed-xdr"
          name="Managed XDR"
          icon={Activity}
          tone="brand"
          value={xdr.summary?.open ?? 0}
          label="detections awaiting triage"
          loading={xdr.isLoading}
        />
        <ProductCard
          to="/workspace/attack-surface"
          name="Attack Surface"
          icon={Globe}
          tone="cyan"
          value={asm.summary?.shadow_it ?? 0}
          label="assets nobody declared"
          loading={asm.isLoading}
        />
        <ProductCard
          to="/workspace/digital-risk"
          name="Digital Risk"
          icon={Fingerprint}
          tone="rose"
          value={drp.summary?.active ?? 0}
          label="impersonations still live"
          loading={drp.isLoading}
        />
        <ProductCard
          to="/workspace/email-protection"
          name="Email Protection"
          icon={Mail}
          tone="fuchsia"
          value={bep.summary?.payload_free ?? 0}
          label="payload-free attempts caught"
          loading={bep.isLoading}
        />
      </div>

      <Panel
        title="Recent incidents"
        description="The most recently opened cases across your environment."
        loading={incidentsLoading}
        error={incidentsError}
        empty={incidents.length === 0}
        emptyLabel="No incidents reported."
      >
        <ul className="flex flex-col divide-y divide-line-soft">
          {incidents.map((incident) => (
            <li key={incident.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-text">{incident.title}</span>
                <span className="text-xs text-muted-2">
                  {incident.reported_by ? `Reported by ${incident.reported_by} · ` : ''}
                  {formatDateTime(incident.created_at)}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <SeverityBadge value={incident.severity} />
                <SeverityBadge value={incident.status} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="rounded-[4px] border border-amber-line bg-amber-soft px-4 py-3 text-xs text-amber">
        This workspace runs on seed data during development — see{' '}
        <span className="font-mono">backend/app/routes/workspace.py</span> for the live endpoints it reads from.
      </div>
    </div>
  )
}
