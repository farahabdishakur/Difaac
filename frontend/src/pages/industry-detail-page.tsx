import { useParams } from 'react-router-dom'
import { CTABanner } from '@/components/shared/cta-banner'
import { IndustryHeroEnhanced } from '@/components/home/industry-hero-enhanced'
import { IndustryChallenges } from '@/components/home/industry-challenges'
import { IndustrySolutions } from '@/components/home/industry-solutions'
import { getIndustryBySlug } from '@/lib/data/industries'
import NotFoundPage from '@/pages/not-found-page'

interface IndustryData {
  challenges: Array<{ title: string; description: string }>
  solutions: Array<{ product: string; benefit: string }>
  highlight: string
  stats: Array<{ stat: string; label: string }>
}

const industryDetails: Record<string, IndustryData> = {
  'financial-services': {
    highlight: 'Enterprise-Grade Cyber Defense for Financial Institutions',
    challenges: [
      {
        title: 'Account Takeover (ATO)',
        description: 'Fraudsters use credential stuffing and brute force to compromise customer accounts and drain balances.',
      },
      {
        title: 'Payment Fraud',
        description: 'Card testing, promo abuse, and synthetic fraud bypass traditional detection methods.',
      },
      {
        title: 'Targeted Intrusions',
        description: 'Threat actors conduct reconnaissance and mount multi-stage attacks against your infrastructure.',
      },
      {
        title: 'Wire Fraud',
        description: 'Social engineering and business email compromise lead to unauthorized wire transfers.',
      },
    ],
    solutions: [
      {
        product: 'Fraud Protection',
        benefit: 'Stop account takeover and payment fraud with device fingerprinting and behavioral analysis.',
      },
      {
        product: 'Threat Intelligence',
        benefit: 'Track threat actors targeting financial institutions and anticipate attacks.',
      },
      {
        product: 'Managed XDR',
        benefit: '24/7 threat detection and response across all your systems and networks.',
      },
      {
        product: 'Business Email Protection',
        benefit: 'Catch business email compromise before wire fraud happens.',
      },
    ],
    stats: [
      { stat: '<100ms', label: 'Fraud decision time' },
      { stat: '99.9%', label: 'Detection accuracy' },
      { stat: '24/7', label: 'Monitoring coverage' },
      { stat: '500M+', label: 'Transactions protected daily' },
    ],
  },
  government: {
    highlight: 'Mission-Critical Threat Intelligence for National Security',
    challenges: [
      {
        title: 'Advanced Persistent Threats',
        description: 'Sophisticated threat actors conduct targeted campaigns against critical systems and sensitive data.',
      },
      {
        title: 'Infrastructure Vulnerability',
        description: 'Legacy systems and interconnected networks create expanded attack surfaces.',
      },
      {
        title: 'Supply Chain Risk',
        description: 'Attackers target vendors and contractors to gain access to protected networks.',
      },
      {
        title: 'Zero-Day Exploitation',
        description: 'New vulnerabilities emerge constantly, requiring rapid detection and response.',
      },
    ],
    solutions: [
      {
        product: 'Threat Intelligence',
        benefit: 'Monitor for advanced threats across dark web and encrypted channels.',
      },
      {
        product: 'Managed XDR',
        benefit: 'Unified detection across endpoints, networks, email, and cloud with analyst oversight.',
      },
      {
        product: 'Attack Surface Management',
        benefit: 'Discover shadow IT and forgotten infrastructure before attackers do.',
      },
      {
        product: 'Digital Risk Protection',
        benefit: 'Monitor for targeted phishing and social engineering campaigns.',
      },
    ],
    stats: [
      { stat: '24/7', label: 'Analyst coverage' },
      { stat: '<15 min', label: 'Response time' },
      { stat: '99.99%', label: 'Platform uptime' },
      { stat: '150+', label: 'Countries supported' },
    ],
  },
  telecom: {
    highlight: 'Advanced Network Protection for Telecommunications Infrastructure',
    challenges: [
      {
        title: 'SIM Swap & Account Fraud',
        description: 'Attackers compromise authentication methods to access subscriber accounts and services.',
      },
      {
        title: 'Network Intrusion',
        description: 'Threat actors penetrate network infrastructure to intercept traffic and data.',
      },
      {
        title: 'Subscriber Data Protection',
        description: 'Customer records containing location, identity, and billing data require protection.',
      },
      {
        title: 'Revenue Assurance',
        description: 'Fraud schemes target billing systems and revenue streams.',
      },
    ],
    solutions: [
      {
        product: 'Fraud Protection',
        benefit: 'Detect unauthorized account compromises and suspicious transactions in real-time.',
      },
      {
        product: 'Threat Intelligence',
        benefit: 'Track threat actors and monitor emerging threats targeting telecom infrastructure.',
      },
      {
        product: 'Managed XDR',
        benefit: '24/7 monitoring of network infrastructure, email, and subscriber systems.',
      },
      {
        product: 'Attack Surface Management',
        benefit: 'Find exposed data and vulnerable network assets before attackers.',
      },
    ],
    stats: [
      { stat: '<100ms', label: 'Detection latency' },
      { stat: '500M+', label: 'Daily transactions monitored' },
      { stat: '99.9%', label: 'Fraud detection rate' },
      { stat: '24/7', label: 'Coverage' },
    ],
  },
  'retail-ecommerce': {
    highlight: 'Intelligent Fraud Prevention for Modern Commerce',
    challenges: [
      {
        title: 'Account Takeover',
        description: 'Fraudsters log in to customer accounts and make unauthorized purchases.',
      },
      {
        title: 'Promotional Abuse',
        description: 'Automated attacks and fraud schemes exploit discounts and promotions.',
      },
      {
        title: 'Payment Card Fraud',
        description: 'Card testing and fraudulent transactions impact revenue and customer trust.',
      },
      {
        title: 'Returns & Refund Fraud',
        description: 'Fraudsters exploit return policies for unauthorized refunds and merchandise.',
      },
    ],
    solutions: [
      {
        product: 'Fraud Protection',
        benefit: 'Detect account takeover and payment fraud while keeping checkout seamless.',
      },
      {
        product: 'Digital Risk Protection',
        benefit: 'Monitor for brand abuse and counterfeit listings on marketplaces.',
      },
      {
        product: 'Threat Intelligence',
        benefit: 'Track emerging fraud tactics and stay ahead of new threats.',
      },
      {
        product: 'Managed XDR',
        benefit: 'Secure your infrastructure and detect breaches before customer data is exposed.',
      },
    ],
    stats: [
      { stat: '99.9%', label: 'Fraud detection rate' },
      { stat: '<1%', label: 'False positive rate' },
      { stat: '<100ms', label: 'Decision time' },
      { stat: '24/7', label: 'Monitoring' },
    ],
  },
  crypto: {
    highlight: 'Comprehensive Threat Defense for Digital Asset Platforms',
    challenges: [
      {
        title: 'Account & Wallet Compromise',
        description: 'Threat actors target private keys and authentication methods through malware and social engineering.',
      },
      {
        title: 'Phishing & Impersonation',
        description: 'Sophisticated phishing sites impersonate exchanges and services to steal credentials.',
      },
      {
        title: 'Smart Contract Risks',
        description: 'Vulnerabilities in blockchain applications create exposure to theft.',
      },
      {
        title: 'Fraud Infrastructure',
        description: 'Criminal operations use blockchain to conduct and monetize fraudulent activities.',
      },
    ],
    solutions: [
      {
        product: 'Threat Intelligence',
        benefit: 'Monitor emerging threats and criminal activity targeting digital assets.',
      },
      {
        product: 'Digital Risk Protection',
        benefit: 'Detect phishing and impersonation sites targeting your platform.',
      },
      {
        product: 'Fraud Protection',
        benefit: 'Real-time detection of unauthorized access and suspicious transactions.',
      },
      {
        product: 'Business Email Protection',
        benefit: 'Stop targeted phishing campaigns against your team.',
      },
    ],
    stats: [
      { stat: '150+', label: 'Countries monitored' },
      { stat: '24/7', label: 'Threat monitoring' },
      { stat: '99.9%', label: 'Detection rate' },
      { stat: '<100ms', label: 'Alert delivery' },
    ],
  },
  healthcare: {
    highlight: 'Clinical-Grade Cybersecurity for Healthcare Organizations',
    challenges: [
      {
        title: 'Ransomware & Extortion',
        description: 'Ransomware attacks target hospitals, disrupting patient care and forcing payments.',
      },
      {
        title: 'Patient Data Protection',
        description: 'Sensitive medical and financial information requires strict protection against breaches.',
      },
      {
        title: 'Medical Device Security',
        description: 'IoT devices and connected equipment create security vulnerabilities if unmonitored.',
      },
      {
        title: 'Third-Party Risk',
        description: 'Vendors and contractors require security oversight to prevent access compromise.',
      },
    ],
    solutions: [
      {
        product: 'Managed XDR',
        benefit: 'Detect and stop ransomware before it encrypts critical patient care systems.',
      },
      {
        product: 'Threat Intelligence',
        benefit: 'Monitor for threats targeting healthcare and emerging attack patterns.',
      },
      {
        product: 'Attack Surface Management',
        benefit: 'Find exposed patient data and vulnerable medical devices.',
      },
      {
        product: 'Business Email Protection',
        benefit: 'Stop phishing campaigns targeting healthcare staff.',
      },
    ],
    stats: [
      { stat: '24/7', label: 'Analyst coverage' },
      { stat: '99.99%', label: 'Platform uptime' },
      { stat: '<15 min', label: 'Response time' },
      { stat: '500M+', label: 'Daily records secured' },
    ],
  },
}

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <NotFoundPage />
  }

  const industry = getIndustryBySlug(slug)
  const details = industryDetails[slug]

  if (!industry || !details) {
    return <NotFoundPage />
  }

  return (
    <>
      <IndustryHeroEnhanced
        slug={industry.slug}
        name={industry.name}
        tagline={industry.tagline}
        description={industry.description}
        icon={industry.icon}
        highlight={details.highlight}
      />

      <section className="bg-ink-2 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {details.stats.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 rounded-lg border border-line-soft bg-ink/60 p-6 text-center backdrop-blur-sm"
              >
                <span className="font-display text-2xl font-bold text-brand lg:text-3xl">
                  {item.stat}
                </span>
                <span className="text-sm text-body">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IndustryChallenges challenges={details.challenges} />

      <IndustrySolutions solutions={details.solutions} industryName={industry.name} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title={`Ready to protect ${industry.name}?`}
            description="Talk to a Difaac specialist to discuss solutions tailored to your industry's unique threats."
          />
        </div>
      </section>
    </>
  )
}
