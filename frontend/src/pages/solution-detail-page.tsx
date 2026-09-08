import { Link, useParams } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { CTABanner } from '@/components/shared/cta-banner'
import { SolutionHeroEnhanced } from '@/components/home/solution-hero-enhanced'
import { SolutionHighlights } from '@/components/home/solution-highlights'
import { GlassIcon } from '@/components/product/product-sections'
import { ProductEmblem } from '@/components/product/product-emblem'
import { getIcon } from '@/components/icons/icon-map'
import { solutionGroupAccent, productAccent, toneText } from '@/lib/tone'
import { getSolutionBySlug } from '@/lib/data/solutions'
import { getProductBySlug } from '@/lib/data/products'
import NotFoundPage from '@/pages/not-found-page'

/**
 * Which products deliver each solution.
 *
 * A solution is a problem framing, not a thing you can buy — the page has to
 * end by naming what actually does the work, or it leaves the reader with a
 * diagnosis and no prescription. Mapped explicitly rather than inferred from
 * keywords so a wrong pairing is a visible edit, not a silent match.
 */
const relatedProducts: Record<string, string[]> = {
  'ransomware-protection': ['managed-xdr', 'threat-intelligence', 'attack-surface-management'],
  'phishing-scam-protection': ['digital-risk-protection', 'business-email-protection'],
  'bot-protection': ['fraud-protection'],
  'dark-web-monitoring': ['threat-intelligence', 'digital-risk-protection'],
  'data-leak-detection': ['digital-risk-protection', 'threat-intelligence'],
  'vulnerability-management': ['attack-surface-management'],
  'network-security': ['managed-xdr', 'threat-intelligence'],
  ciso: ['managed-xdr', 'threat-intelligence', 'attack-surface-management'],
  'head-of-fraud': ['fraud-protection', 'digital-risk-protection'],
  'head-of-brand-protection': ['digital-risk-protection', 'business-email-protection'],
  'head-of-threat-intelligence': ['threat-intelligence'],
  'soc-manager': ['managed-xdr', 'threat-intelligence'],
  'security-analyst': ['threat-intelligence', 'managed-xdr'],
}

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

  const tone = solutionGroupAccent[solution.group]
  // The products that actually deliver this solution. A solution page that
  // never names them leaves the reader with a problem and no way to buy the
  // answer, which is the one thing it exists to prevent.
  const related = relatedProducts[slug] ?? []

  return (
    <>
      <SolutionHeroEnhanced
        name={solution.name}
        tagline={solution.tagline}
        description={solution.description}
        group={solution.group}
      />

      <SolutionHighlights highlights={solution.highlights || details.benefits.slice(0, 4)} group={solution.group} />

      {/* What the solution actually does, as an ordered capability list. */}
      <section className="border-t border-line-soft bg-ink-2 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className={`text-xs font-medium uppercase tracking-[0.16em] ${toneText[tone]}`}>
              Capabilities
            </span>
            <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
              What {solution.name} puts in place
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {details.benefits.map((benefit, index) => (
              <div key={benefit} className="flex items-start gap-4 bg-ink px-6 py-6">
                <span className="mt-0.5 font-mono text-xs text-muted-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed text-body">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who runs into this, in their own words. */}
      <section className="border-t border-line-soft py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
              Where it applies
            </span>
            <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
              Teams that come to us with this
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {details.useCases.map((useCase) => (
              <div
                key={useCase}
                className="flex items-start gap-4 rounded-lg border border-line bg-ink-2/60 p-6 transition-colors hover:border-brand/40"
              >
                <GlassIcon icon={Check} tone={tone} size="sm" />
                <p className="text-sm leading-relaxed text-body">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The products behind it. */}
      {related.length > 0 ? (
        <section className="border-t border-line-soft bg-ink-2 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
                Delivered by
              </span>
              <h2 className="mt-4 text-balance font-display t-h2 font-medium text-text">
                The products that do this work
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((productSlug) => {
                const product = getProductBySlug(productSlug)
                if (!product) return null
                const Icon = getIcon(product.icon)
                return (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="group flex flex-col gap-4 rounded-lg border border-line bg-ink/60 p-6 transition-colors hover:border-brand/40 hover:bg-ink-3"
                  >
                    <ProductEmblem
                      icon={Icon}
                      tone={productAccent[product.slug] ?? 'brand'}
                      slug={product.slug}
                      size="card"
                    />
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-base font-medium text-text">{product.name}</h3>
                      <p className="text-sm leading-relaxed text-body">{product.tagline}</p>
                    </div>
                    <span className="mt-auto flex items-center gap-2 text-xs font-medium text-brand">
                      Explore the product
                      <ArrowRight
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-line-soft py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title={`See ${solution.name} against your environment`}
            highlight={solution.name}
            description="Tell us what you are defending and we will show you what this looks like on your own estate rather than in the abstract."
          />
        </div>
      </section>
    </>
  )
}
