import { Radar, Fingerprint, ShieldAlert, Siren, Users } from 'lucide-react'
import { StatCard } from '@/components/workspace/stat-card'
import { Panel } from '@/components/workspace/panel'
import { SeverityBadge } from '@/components/workspace/severity-badge'
import { useAuthUser } from '@/hooks/use-auth'
import { useIocs, useThreatActors, usePhishingDomains, useFraudCases, useIncidents } from '@/lib/workspace-api'

export default function OverviewPage() {
  const user = useAuthUser()
  const { iocs, isLoading: iocsLoading } = useIocs()
  const { actors, isLoading: actorsLoading } = useThreatActors()
  const { domains, isLoading: domainsLoading } = usePhishingDomains()
  const { cases, isLoading: casesLoading } = useFraudCases()
  const { incidents, error: incidentsError, isLoading: incidentsLoading } = useIncidents(5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text">
          Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-body">Here is what Difaac is tracking for your organisation right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Indicators of Compromise" value={iocs.length} icon={Radar} tone="violet" loading={iocsLoading} />
        <StatCard label="Tracked Threat Actors" value={actors.length} icon={Users} tone="violet" loading={actorsLoading} />
        <StatCard label="Phishing Domains" value={domains.length} icon={Fingerprint} tone="rose" loading={domainsLoading} />
        <StatCard label="Fraud Cases" value={cases.length} icon={ShieldAlert} tone="blue" loading={casesLoading} />
      </div>

      <Panel
        title="Recent incidents"
        description="The five most recently reported incidents across your environment."
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
                  {new Date(incident.created_at).toLocaleString()}
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
