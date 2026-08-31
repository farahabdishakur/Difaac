import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { cn } from '@/lib/utils'

/**
 * Frames a product mockup panel in the same glass treatment as the hero
 * image: a soft brand-coloured glow behind a translucent border, so the
 * panel reads as a real surface floating in the page rather than a plain
 * bordered box.
 *
 * The glow is brand green on every panel. The per-product accent hues used
 * on the product pages themselves are deliberately not brought onto the
 * home page: three different colours stacked down one scroll would read as
 * decoration rather than as identity, and the home page's job is to say
 * "Difaac", not to preview six palettes.
 */
function PanelFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[1.5rem] bg-brand/20 opacity-40 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[4px] border border-line/80 bg-ink-2/80 backdrop-blur-sm">
        <div className="bg-ink/60 px-4 py-2.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">{title}</span>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-[11px] text-muted-2">{label}</span>
      <span className="text-right text-xs text-text">{value}</span>
    </div>
  )
}

function ThreatIntelPanel() {
  return (
    <PanelFrame title="Actor profile">
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-base font-semibold text-text">APT34</span>
        <span className="rounded-[2px] border border-error/40 px-1.5 py-0.5 text-[10px] font-medium text-error">
          Active
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted-2">Tracked since 2019 · 12 linked campaigns</p>

      <div className="mt-3 divide-y divide-line-soft border-t border-line-soft">
        <Row label="Techniques" value="T1566 · T1059 · T1071" />
        <Row label="Primary targets" value="Energy, Government" />
        <Row label="Known infrastructure" value="47 hosts" />
        <Row label="Last observed" value="4 hours ago" />
      </div>
    </PanelFrame>
  )
}

function FraudPanel() {
  return (
    <PanelFrame title="Session decision">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-2xl font-semibold tracking-tight text-text">82</span>
        <span className="rounded-[2px] border border-warning/40 px-1.5 py-0.5 text-[10px] font-medium text-warning">
          Challenge
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted-2">Risk score out of 100 · scored in 24 ms</p>

      <div className="mt-3 divide-y divide-line-soft border-t border-line-soft">
        <Row label="Device" value="Known · 3 prior sessions" />
        <Row label="Behaviour" value="Automation suspected" />
        <Row label="Network" value="Residential proxy" />
        <Row label="Action" value="Step-up authentication" />
      </div>
    </PanelFrame>
  )
}

function AttackSurfacePanel() {
  const assets = [
    { host: 'api.example.com', finding: 'TLS 1.0 enabled', risk: 'High', tone: 'text-warning border-warning/40' },
    { host: 'legacy.example.net', finding: 'Unpatched service', risk: 'Critical', tone: 'text-error border-error/40' },
    { host: 'vpn.example.org', finding: 'Port 8080 open', risk: 'Medium', tone: 'text-muted-2 border-line' },
  ]

  return (
    <PanelFrame title="Discovered assets">
      <ul className="divide-y divide-line-soft">
        {assets.map((asset) => (
          <li key={asset.host} className="flex items-center gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-text">{asset.host}</span>
              <span className="block truncate text-[11px] text-muted-2">{asset.finding}</span>
            </div>
            <span className={cn('shrink-0 rounded-[2px] border px-1.5 py-0.5 text-[10px] font-medium', asset.tone)}>
              {asset.risk}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-line-soft pt-3 text-[11px] text-muted-2">
        <span className="text-text">312 assets</span> discovered · 8 added this week
      </p>
    </PanelFrame>
  )
}

const showcases = [
  {
    slug: 'threat-intelligence',
    name: 'Threat Intelligence',
    description:
      'Track the groups that actually target your sector, with their infrastructure and tradecraft mapped to MITRE ATT&CK and delivered straight into your SOC.',
    panel: <ThreatIntelPanel />,
  },
  {
    slug: 'fraud-protection',
    name: 'Fraud Protection',
    description:
      'Score every session and transaction in milliseconds, so account takeover and payment fraud are stopped without adding friction for legitimate customers.',
    panel: <FraudPanel />,
  },
  {
    slug: 'attack-surface-management',
    name: 'Attack Surface Management',
    description:
      'Continuously discover the assets tied to your organisation, including the ones nobody documented, and rank exposures by what an attacker could actually use.',
    panel: <AttackSurfacePanel />,
  },
]

export function ProductShowcase() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:gap-24 lg:px-8">
        {showcases.map((item, index) => (
          <div
            key={item.slug}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={cn('flex flex-col gap-5', index % 2 === 1 && 'lg:order-2')}>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
                {item.name}
              </span>
              <h3 className="text-balance font-display text-[clamp(24px,2.8vw,34px)] font-semibold leading-tight tracking-tight text-text">
                {item.description}
              </h3>
              <div className="pt-1">
                <LinkButton
                  href={`/products/${item.slug}`}
                  variant="secondary"
                  size="default"
                >
                  Learn more
                  <ArrowRight className="size-3.5" data-icon="inline-end" />
                </LinkButton>
              </div>
            </div>

            <div className={cn(index % 2 === 1 && 'lg:order-1')}>{item.panel}</div>
          </div>
        ))}
      </div>
    </section>
  )
}


