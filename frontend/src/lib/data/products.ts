/**
 * Static product catalogue.
 *
 * `Product` mirrors the shape returned by the FastAPI `/products` endpoints,
 * so this doubles as the offline fallback for SWR. Page-only editorial copy
 * (metrics, use cases, delivery) lives in `product-content.ts` instead.
 */

export type Product = {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
  capabilities: { title: string; description: string }[]
  bullets: string[]
}

export const products: Product[] = [
  {
    slug: 'threat-intelligence',
    name: 'Threat Intelligence',
    tagline: 'Understand adversaries before they strike.',
    description:
      'Continuous monitoring of global threat actor infrastructure, TTPs, and campaigns, delivered directly to your SOC.',
    icon: 'Radar',
    bullets: [
      'Tracks 700+ threat actor groups and their infrastructure in real time',
      'Maps tactics, techniques, and procedures to MITRE ATT&CK',
      'Delivers indicators of compromise directly into your SIEM or SOAR',
      'Custom collection scoped to your sector and region',
    ],
    capabilities: [
      { title: 'Actor tracking', description: 'Profiles of threat actors, their tooling, and known infrastructure, updated continuously.' },
      { title: 'Campaign attribution', description: 'Links incidents to known campaigns using behavioral and infrastructure overlap.' },
      { title: 'Dark web collection', description: 'Automated crawling of closed forums, marketplaces, and messaging channels.' },
      { title: 'Feed integration', description: 'STIX/TAXII and API delivery into existing detection and response tooling.' },
    ],
  },
  {
    slug: 'fraud-protection',
    name: 'Fraud Protection',
    tagline: 'Eliminate fraud without adding friction.',
    description:
      'Real-time fraud prevention and client-side identity protection that stops account takeover and payment fraud as it happens.',
    icon: 'ShieldCheck',
    bullets: [
      'Device fingerprinting across web and mobile sessions',
      'Behavioral biometrics detect bots and scripted attacks',
      'Real-time scoring on login, checkout, and account changes',
      'Shared fraud intelligence across the Difaac customer network',
    ],
    capabilities: [
      { title: 'Device fingerprinting', description: 'Identifies devices with persistent, tamper-resistant fingerprints.' },
      { title: 'Behavioral analysis', description: 'Distinguishes human behavior from automation at the session level.' },
      { title: 'Risk scoring', description: 'Scores every session and transaction against fraud signals in milliseconds.' },
      { title: 'Case management', description: 'Investigation workspace for fraud analysts with full session replay.' },
    ],
  },
  {
    slug: 'managed-xdr',
    name: 'Managed XDR',
    tagline: 'Detect and disrupt attacks in progress.',
    description:
      '24/7 real-time detection and response across endpoints, network, email, and cloud, backed by a dedicated analyst team.',
    icon: 'Activity',
    bullets: [
      'Unified telemetry from endpoint, network, email, and cloud',
      'Human-led triage on every high-confidence alert',
      'Mean time to respond under 15 minutes for critical incidents',
      'Direct containment actions taken on your behalf, with approval workflows',
    ],
    capabilities: [
      { title: 'Unified detection', description: 'Correlates signals across every layer of your environment into one timeline.' },
      { title: '24/7 SOC', description: 'Analysts monitor, triage, and escalate around the clock.' },
      { title: 'Guided response', description: 'Pre-approved playbooks contain threats before they spread.' },
      { title: 'Threat hunting', description: 'Proactive hunts based on the latest adversary tradecraft.' },
    ],
  },
  {
    slug: 'attack-surface-management',
    name: 'Attack Surface Management',
    tagline: 'Manage your attack surface continuously.',
    description:
      'Continuously discover external assets, mitigate exposure, and track risk across your full digital footprint.',
    icon: 'Globe',
    bullets: [
      'Automated discovery of domains, IPs, and cloud assets',
      'Continuous exposure scanning without agents',
      'Risk prioritization based on exploitability, not just severity',
      'Shadow IT and forgotten infrastructure surfaced automatically',
    ],
    capabilities: [
      { title: 'Asset discovery', description: 'Maps every external-facing asset tied to your organization.' },
      { title: 'Exposure scanning', description: 'Identifies misconfigurations, open ports, and vulnerable services.' },
      { title: 'Risk prioritization', description: 'Ranks findings by real-world exploitability and business impact.' },
      { title: 'Continuous monitoring', description: 'Detects new and changed assets as they appear.' },
    ],
  },
  {
    slug: 'digital-risk-protection',
    name: 'Digital Risk Protection',
    tagline: 'Protect your brand across the open, deep, and dark web.',
    description:
      'AI-powered digital risk identification, takedown, and brand protection across social media, marketplaces, and the dark web.',
    icon: 'Fingerprint',
    bullets: [
      'Detects phishing domains and impersonation within minutes of registration',
      'Automated takedown workflows with legal and hosting partners',
      'Monitors marketplaces and social platforms for counterfeit and abuse',
      'Executive protection against impersonation and doxxing',
    ],
    capabilities: [
      { title: 'Domain monitoring', description: 'Flags typosquats and lookalike domains as they are registered.' },
      { title: 'Takedown operations', description: 'In-house takedown team with direct registrar and host relationships.' },
      { title: 'Brand monitoring', description: 'Scans marketplaces and social platforms for unauthorized use.' },
      { title: 'Executive protection', description: 'Monitors for impersonation and exposure of key personnel.' },
    ],
  },
  {
    slug: 'business-email-protection',
    name: 'Business Email Protection',
    tagline: 'Stop email threats before they reach the inbox.',
    description:
      'Patented email security that detonates and hunts advanced threats, including business email compromise and payload-free attacks.',
    icon: 'Mail',
    bullets: [
      'Detonation sandboxing for attachments and embedded links',
      'Detects payload-free business email compromise attempts',
      'Retroactive hunting across historical mail flow',
      'Deploys without changing existing mail routing',
    ],
    capabilities: [
      { title: 'Threat detonation', description: 'Executes suspicious content in isolated environments before delivery.' },
      { title: 'BEC detection', description: 'Identifies impersonation and social engineering without relying on payloads.' },
      { title: 'Retroactive hunting', description: 'Re-scans delivered mail as new intelligence emerges.' },
      { title: 'Seamless deployment', description: 'API-based integration with existing mail infrastructure.' },
    ],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}
