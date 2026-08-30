import { useParams } from 'react-router-dom'
import { CTABanner } from '@/components/shared/cta-banner'
import { SolutionHeroEnhanced } from '@/components/home/solution-hero-enhanced'
import { SolutionHighlights } from '@/components/home/solution-highlights'
import { getSolutionBySlug } from '@/lib/data/solutions'
import NotFoundPage from '@/pages/not-found-page'

const solutionDetails: Record<string, { benefits: string[]; useCases: string[] }> = {
  'ransomware-protection': {
    benefits: [
      'Detect ransomware execution signatures and behavioral patterns',
      'Disrupt command-and-control communication before encryption spreads',
      'Automated incident response playbooks for rapid containment',
      'Ransomware family identification and tracking',
      'Backup and recovery guidance post-infection',
      'Insurance coordination and extortion negotiations support',
    ],
    useCases: [
      'Hospitals defending patient care systems',
      'Manufacturing protecting production infrastructure',
      'Government agencies securing critical systems',
      'Financial institutions protecting customer assets',
    ],
  },
  'phishing-scam-protection': {
    benefits: [
      'Real-time detection of phishing domains within minutes of registration',
      'Automated takedown coordination with registrars and hosting providers',
      'Monitoring across social media, emails, and messaging platforms',
      'Impersonation and lookalike domain detection',
      'Geo-targeted phishing campaign tracking',
      'Executive protection against targeted social engineering',
    ],
    useCases: [
      'Banks defending against credential theft campaigns',
      'E-commerce sites protecting customer accounts',
      'Tech companies securing employee credentials',
      'Brands defending reputation and customer trust',
    ],
  },
  'bot-protection': {
    benefits: [
      'Behavioral biometrics to distinguish humans from automation',
      'Device fingerprinting for session-level bot detection',
      'Real-time scoring without CAPTCHAs or friction',
      'Credential stuffing and password spraying detection',
      'Inventory scraping prevention for retail',
      'Scalping and ticket fraud prevention',
    ],
    useCases: [
      'Retail and ticketing sites combating scalping',
      'Subscription services preventing credential abuse',
      'APIs protecting against automated attacks',
      'Gaming platforms stopping bot farming',
    ],
  },
  'dark-web-monitoring': {
    benefits: [
      'Automated monitoring of closed forums and marketplaces',
      'Alerts on mentions of your organization, brands, and executives',
      'Data breach detection and credential leaks',
      'Threat actor communication tracking',
      'Competitive intelligence gathering',
      'Fraud marketplace detection',
    ],
    useCases: [
      'Financial services monitoring for data leaks',
      'Healthcare protecting patient data exposure',
      'Tech companies tracking stolen source code',
      'Government agencies monitoring state-sponsored threats',
    ],
  },
  'data-leak-detection': {
    benefits: [
      'Automated scanning of paste sites and forums',
      'Employee credential and source code leak detection',
      'API key and database connection string identification',
      'Customer data exposure monitoring',
      'Threat intelligence on where your data appears',
      'Regulatory notification support (GDPR, CCPA)',
    ],
    useCases: [
      'SaaS companies protecting customer data',
      'DevOps teams securing hardcoded credentials',
      'Enterprises tracking insider threats',
      'Regulated industries meeting compliance requirements',
    ],
  },
  'vulnerability-management': {
    benefits: [
      'Prioritization by active exploitation in the wild',
      'Correlation with threat intelligence for context',
      'Automated remediation workflow integration',
      'Patch management and testing acceleration',
      'Risk scoring that accounts for asset criticality',
      'Supply chain vulnerability tracking',
    ],
    useCases: [
      'Enterprise security teams managing at scale',
      'Cloud environments with rapid changes',
      'Organizations with limited patch resources',
      'Regulated industries needing compliance documentation',
    ],
  },
  'network-security': {
    benefits: [
      'Detection of lateral movement and privilege escalation',
      'Command-and-control (C2) traffic identification',
      'Data exfiltration prevention and monitoring',
      'Network reconnaissance detection',
      'Encrypted traffic analysis',
      'Zero-trust network policy enforcement',
    ],
    useCases: [
      'Financial services defending against APTs',
      'Government protecting critical infrastructure',
      'Healthcare securing connected medical devices',
      'Enterprise networks detecting insider threats',
    ],
  },
  ciso: {
    benefits: [
      'Real-time executive risk dashboards',
      'Board-ready reporting with industry benchmarking',
      'Consolidated visibility across all security tools',
      'Risk quantification for budget planning',
      'Regulatory compliance tracking and evidence',
      'Third-party/vendor risk assessment',
    ],
    useCases: [
      'Translating technical findings for the board',
      'Justifying security budget to CFO',
      'Regulatory compliance and audit preparation',
      'Risk management and incident reporting',
    ],
  },
  'head-of-fraud': {
    benefits: [
      'Real-time fraud prevention without checkout friction',
      'Device and behavioral fingerprinting at scale',
      'Account takeover and payment fraud detection',
      'Chargeback and dispute analytics',
      'Carrier/network fraud prevention',
      'Fraud ring identification and tracking',
    ],
    useCases: [
      'E-commerce protecting revenue from payment fraud',
      'Financial services securing customer accounts',
      'Subscription services preventing credential abuse',
      'Marketplaces protecting sellers and buyers',
    ],
  },
  'head-of-brand-protection': {
    benefits: [
      'Automated takedown workflows with direct registrar relationships',
      'Marketplace counterfeit and unauthorized seller detection',
      'Social media brand abuse monitoring',
      'Executive impersonation and doxxing alerts',
      'Crisis response coordination',
      'Brand reputation protection across channels',
    ],
    useCases: [
      'Luxury brands combating counterfeits',
      'Tech companies protecting brand reputation',
      'Entertainment fighting ticket fraud',
      'Consumer brands securing marketplace presence',
    ],
  },
  'head-of-threat-intelligence': {
    benefits: [
      'Curated adversary profiles mapped to MITRE ATT&CK',
      'Automated IOC enrichment and feed generation',
      'Sector-specific threat briefings',
      'SIEM/SOAR integration for operationalization',
      'Custom research and analysis',
      'Intelligence sharing and coordination',
    ],
    useCases: [
      'Building a threat intelligence program from scratch',
      'Scaling intelligence operations',
      'Compliance with intelligence standards',
      'Leadership briefings and risk reporting',
    ],
  },
  'soc-manager': {
    benefits: [
      'Alert triage prioritized by confirmed risk',
      'Playbook-driven response automation',
      'Cross-team case management and escalation',
      'Analyst performance analytics and training',
      'Mean time to detect (MTTD) reduction',
      'Alert fatigue reduction without coverage loss',
    ],
    useCases: [
      'Scaling SOC operations efficiently',
      'Improving analyst productivity and retention',
      'Reducing alert fatigue and burnout',
      'Optimizing incident response workflows',
    ],
  },
  'security-analyst': {
    benefits: [
      'One-click pivoting across intelligence sources',
      'Enriched indicators with adversary context and TTPs',
      'Guided investigation workflows and templates',
      'Exportable case reports for documentation',
      'Historical correlation and pattern matching',
      'Automated enrichment and hypothesis testing',
    ],
    useCases: [
      'Investigating security incidents faster',
      'Threat hunting with historical data',
      'Incident response with full context',
      'Knowledge transfer between analysts',
    ],
  },
}

export default function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <NotFoundPage />
  }

  const solution = getSolutionBySlug(slug)
  const details = solutionDetails[slug]

  if (!solution || !details) {
    return <NotFoundPage />
  }

  return (
    <>
      <SolutionHeroEnhanced
        name={solution.name}
        tagline={solution.tagline}
        description={solution.description}
        icon={solution.icon}
        group={solution.group}
      />

      <SolutionHighlights highlights={solution.highlights || details.benefits.slice(0, 4)} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
              Full Benefits
            </span>
            <h2 className="mt-6 font-display text-[clamp(28px,4vw,42px)] font-bold leading-tight text-text">
              Complete capabilities
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {details.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-lg border border-line-soft bg-gradient-to-br from-brand-ink/20 to-transparent p-6"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-xs font-bold text-brand">
                  ✓
                </div>
                <p className="text-sm leading-relaxed text-body">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-tight text-text">
              Common use cases
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {details.useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-lg border border-line-soft bg-ink-2 p-6 transition-all duration-200 hover:border-brand/40"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-ink">
                  <span className="text-lg text-brand">→</span>
                </div>
                <p className="text-sm leading-relaxed text-body">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title={`Ready to implement ${solution.name}?`}
            description="Talk to a Difaac specialist to see how this solution fits your organization."
          />
        </div>
      </section>
    </>
  )
}
