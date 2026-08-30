/**
 * Full page content for the six product marketing pages.
 *
 * Every product page renders from this data through the shared components in
 * `@/components/product`, so a product gets a complete page by adding an entry
 * here rather than by copying a folder of near-identical components.
 *
 * `icon` values are keys of the shared icon map (`@/components/icons/icon-map`).
 * `tone` picks one of the three accent treatments the cards support.
 */

// `Tone` and the per-product accent assignment live in `@/lib/tone`, which
// every hero across products, solutions, services, and industries shares.
import type { Tone } from '@/lib/tone'
export type { Tone } from '@/lib/tone'
export { productAccent } from '@/lib/tone'

export type ProductPageContent = {
  hero: {
    badge: string
    badgeIcon: string
    headlineLead: string
    headlineAccent: string
    description: string
    stats: { value: string; label: string }[]
  }
  band: {
    eyebrow: string
    headline: string
    description: string
    cards: { icon: string; label: string; value: string; tone: Tone }[]
  }
  metrics: { value: string; label: string }[]
  overview: {
    title: string
    body: string
    capabilities: { title: string; description: string }[]
  }
  featureGrid: {
    heading: string
    items: { icon: string; title: string; description: string; tone: Tone }[]
  }
  tabs: {
    heading: string
    description: string
    items: {
      id: string
      label: string
      title: string
      description: string
      icon: string
      details: string[]
    }[]
  }
  comparison: {
    heading: string
    description: string
    columns: [string, string, string]
    columnSubs: [string, string, string]
    rows: { feature: string; values: [boolean, boolean, boolean] }[]
  }
  pillars: {
    eyebrow: string
    heading: string
    description: string
    items: { icon: string; title: string; description: string; details: string[] }[]
  }
  benefits: {
    eyebrow: string
    heading: string
    items: { icon: string; title: string; description: string }[]
  }
  faqs: { question: string; answer: string }[]
  trust: {
    heading: string
    description: string
    items: { stat: string; label: string }[]
  }
  cta: { title: string; description: string }
}

export const productPages: Record<string, ProductPageContent> = {
  'threat-intelligence': {
    hero: {
      badge: 'Threat Intelligence Platform',
      badgeIcon: 'Radar',
      headlineLead: 'See attacks before they ',
      headlineAccent: 'happen',
      description:
        'Continuous tracking of threat actor infrastructure, tactics, and campaigns, delivered pre-scored into the tools your SOC already runs.',
      stats: [
        { value: '700+', label: 'Threat Actors' },
        { value: 'MITRE', label: 'ATT&CK Mapped' },
        { value: '<5 min', label: 'Alert Delivery' },
        { value: '24/7', label: 'Collection' },
      ],
    },
    band: {
      eyebrow: 'Real-time Threat Intelligence',
      headline: 'Monitor. Attribute. Act.',
      description: 'Global adversary collection turned into intelligence your analysts can use today.',
      cards: [
        { icon: 'Globe', label: 'Coverage', value: 'Global Collection', tone: 'cyan' },
        { icon: 'Crosshair', label: 'Tracking', value: '700+ Actor Groups', tone: 'brand' },
        { icon: 'Clock', label: 'Freshness', value: 'Continuous Updates', tone: 'violet' },
        { icon: 'Zap', label: 'Delivery', value: 'Pre-scored IOCs', tone: 'brand' },
      ],
    },
    metrics: [
      { value: '700+', label: 'Threat actor groups tracked' },
      { value: 'MITRE ATT&CK', label: 'Techniques mapped' },
      { value: 'STIX/TAXII', label: 'Native feed delivery' },
    ],
    overview: {
      title: 'Understand adversaries before they strike',
      body: 'Difaac collects across closed forums, marketplaces, malware, and infrastructure telemetry, then attributes what it finds to known actors and campaigns. Indicators arrive scored and enriched, so triage teams close false positives fast and escalate real intrusions faster.',
      capabilities: [
        { title: 'Actor tracking', description: 'Profiles of threat actors, their tooling, and known infrastructure, updated continuously.' },
        { title: 'Campaign attribution', description: 'Links incidents to known campaigns using behavioural and infrastructure overlap.' },
        { title: 'Dark web collection', description: 'Automated crawling of closed forums, marketplaces, and messaging channels.' },
        { title: 'Feed integration', description: 'STIX/TAXII and API delivery into existing detection and response tooling.' },
      ],
    },
    featureGrid: {
      heading: 'Intelligence across the full adversary lifecycle',
      items: [
        { icon: 'Crosshair', title: 'Threat Actor Intelligence', description: 'Track actor groups with real-time infrastructure and TTP mapping.', tone: 'brand' },
        { icon: 'Globe', title: 'Dark Web Monitoring', description: 'Automated crawlers across forums, marketplaces, and encrypted channels.', tone: 'cyan' },
        { icon: 'Link2', title: 'Campaign Attribution', description: 'Link incidents to campaigns through behavioural and infrastructure overlap.', tone: 'violet' },
        { icon: 'Bug', title: 'Vulnerability Intelligence', description: 'Connect disclosed CVEs to active exploitation and actor tooling.', tone: 'brand' },
        { icon: 'Zap', title: 'SIEM & SOAR Delivery', description: 'Pre-scored indicators via STIX/TAXII and REST API.', tone: 'cyan' },
        { icon: 'Search', title: 'Threat Hunting', description: 'Proactive hunts and custom research scoped to your environment.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'Built for your intelligence workflow',
      description: 'Five capabilities that work together from collection through to action.',
      items: [
        {
          id: 'actor-tracking',
          label: 'Actor tracking',
          title: 'Profile threat actors in real time',
          description: 'Continuous profiles of 700+ groups with their tooling, infrastructure, and tactics.',
          icon: 'Radar',
          details: [
            'Real-time tracking of 700+ threat actor groups',
            'Known infrastructure and tooling catalogues',
            'Tactical profiles aligned to MITRE ATT&CK',
            'Sector and region filtering for your organisation',
          ],
        },
        {
          id: 'dark-web',
          label: 'Dark web collection',
          title: 'Automated dark web monitoring',
          description: 'Crawlers deployed to closed forums, marketplaces, and messaging channels.',
          icon: 'Globe',
          details: [
            'Automated crawling of closed forums and markets',
            'Breach database and credential leak monitoring',
            'Threat actor communication channels',
            'Custom collection scoped to your sector',
          ],
        },
        {
          id: 'attribution',
          label: 'Attribution',
          title: 'Link incidents to known campaigns',
          description: 'Behavioural and infrastructure overlap connects observed activity to known adversaries.',
          icon: 'Target',
          details: [
            'Behavioural pattern matching and analysis',
            'Infrastructure overlap detection',
            'Campaign correlation across sources',
            'Confidence scoring on every attribution',
          ],
        },
        {
          id: 'indicators',
          label: 'Indicator delivery',
          title: 'Pre-scored indicators in your tools',
          description: 'Indicators of compromise delivered straight into your SIEM or SOAR.',
          icon: 'Zap',
          details: [
            'STIX/TAXII standard feed delivery',
            'Indicators pre-scored by confidence and severity',
            'Direct SIEM and SOAR integration',
            'REST API for custom enrichment workflows',
          ],
        },
        {
          id: 'reporting',
          label: 'Reporting',
          title: 'Intelligence leadership can act on',
          description: 'Actor profiles and campaign reporting translated into business risk.',
          icon: 'FileText',
          details: [
            'Scheduled sector and region threat briefings',
            'Board-ready risk summaries',
            'Custom research on request',
            'Exportable reports for stakeholders',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Why teams choose Difaac Threat Intelligence',
      description: 'More context than open feeds, more accessible than boutique intelligence retainers.',
      columns: ['Difaac', 'Open Source', 'Premium'],
      columnSubs: ['Platform', 'Feeds', 'Retainers'],
      rows: [
        { feature: 'Threat actor profiles', values: [true, false, true] },
        { feature: 'Real-time dark web collection', values: [true, false, false] },
        { feature: 'Campaign attribution', values: [true, false, true] },
        { feature: 'SIEM / SOAR integration', values: [true, true, false] },
        { feature: 'Pre-scored indicators', values: [true, false, true] },
        { feature: 'MITRE ATT&CK mapping', values: [true, false, true] },
        { feature: 'Sector-specific filtering', values: [true, false, false] },
        { feature: 'Analyst support included', values: [true, false, true] },
      ],
    },
    pillars: {
      eyebrow: 'Three pillars',
      heading: 'Intelligence for every level',
      description: 'From strategic planning through to tactical response.',
      items: [
        {
          icon: 'Brain',
          title: 'Strategic intelligence',
          description: 'Understand threat trends and anticipate attacks targeting your sector.',
          details: ['Adversary capability tracking', 'Sector threat forecasting', 'Leadership risk briefings'],
        },
        {
          icon: 'Target',
          title: 'Operational intelligence',
          description: 'Strengthen defences with detail on attacker behaviour and infrastructure.',
          details: ['Campaign mapping', 'Infrastructure catalogues', 'Technique attribution'],
        },
        {
          icon: 'TrendingUp',
          title: 'Tactical intelligence',
          description: 'Identify attacks faster and cut incident response time.',
          details: ['Pre-scored indicators', 'Detection at scale', 'Investigation context'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Threat Intelligence',
      heading: 'What changes for your team',
      items: [
        { icon: 'AlertCircle', title: 'Identify risks earlier', description: 'Proactive actor tracking surfaces threats before they reach you.' },
        { icon: 'BarChart3', title: 'Prioritise vulnerabilities', description: 'Patch what is actively exploited, not just what scores highest.' },
        { icon: 'Workflow', title: 'Automate enrichment', description: 'Indicators feed detection and response tooling directly.' },
        { icon: 'Layers', title: 'No new console to learn', description: 'Intelligence lands in the SIEM and SOAR analysts already work in.' },
        { icon: 'DollarSign', title: 'Cut wasted analysis', description: 'Filtering to your sector removes the noise analysts burn hours on.' },
        { icon: 'Users', title: 'Brief leadership credibly', description: 'Technical activity translated into board-level risk language.' },
      ],
    },
    faqs: [
      {
        question: 'How is this different from open source threat feeds?',
        answer:
          'Open feeds provide raw indicators without context or attribution. Difaac indicators arrive pre-scored, attributed to known actors, and filtered to your sector and region, so analysts work with high-confidence intelligence rather than alert noise.',
      },
      {
        question: 'How fresh is the intelligence?',
        answer:
          'Collection runs continuously. Indicators are delivered as they are identified, with dark web sources crawled multiple times daily. Campaign updates and actor profile changes propagate to your organisation immediately.',
      },
      {
        question: 'Can we filter intelligence by sector or region?',
        answer:
          'Yes. During onboarding you define your sector, regions of operation, and actor priorities. The platform filters the global feed to what is relevant to you.',
      },
      {
        question: 'How does it integrate with our SIEM?',
        answer:
          'Indicators are delivered through standard STIX/TAXII feeds and a REST API, which integrate with Splunk, QRadar, ArcSight, and others. Your SIEM matches them against incoming telemetry and detections arrive enriched with actor and campaign context.',
      },
      {
        question: 'What if we already run another intelligence platform?',
        answer:
          'Difaac works alongside existing tooling. Many teams run it for complementary coverage, and the APIs make it straightforward to layer Difaac intelligence into workflows you already have.',
      },
      {
        question: 'What reporting is included?',
        answer:
          'Scheduled briefings summarise threats targeting your organisation, and custom reports on specific actors or campaigns are available on request. Every report carries context, indicators, and recommended actions.',
      },
    ],
    trust: {
      heading: 'Intelligence teams run on Difaac',
      description: 'Collection, attribution, and delivery built for security teams of every size.',
      items: [
        { stat: '700+', label: 'Threat actors tracked' },
        { stat: '150+', label: 'Countries monitored' },
        { stat: '99.99%', label: 'Platform uptime' },
        { stat: '24/7', label: 'Analyst support' },
        { stat: '<5 min', label: 'Indicator delivery' },
        { stat: 'STIX/TAXII', label: 'Native integration' },
      ],
    },
    cta: {
      title: 'Ready to see threats before they become incidents?',
      description:
        "Book a walkthrough with a Difaac threat intelligence specialist, scoped to your sector and threat landscape.",
    },
  },

  'fraud-protection': {
    hero: {
      badge: 'Fraud Prevention Platform',
      badgeIcon: 'ShieldCheck',
      headlineLead: 'Stop fraud ',
      headlineAccent: 'without friction',
      description:
        'Real-time fraud prevention and identity protection that stops account takeover and payment fraud as it happens, without slowing legitimate customers down.',
      stats: [
        { value: '<100ms', label: 'Decision Time' },
        { value: 'Web + App', label: 'Coverage' },
        { value: 'Real-time', label: 'Scoring' },
        { value: 'Network', label: 'Intelligence' },
      ],
    },
    band: {
      eyebrow: 'Real-time Fraud Detection',
      headline: 'Identify. Block. Investigate.',
      description: 'Device fingerprinting, behavioural analysis, and risk scoring in milliseconds.',
      cards: [
        { icon: 'ShieldCheck', label: 'Accounts', value: 'ATO Prevention', tone: 'brand' },
        { icon: 'Smartphone', label: 'Coverage', value: 'Web and Mobile', tone: 'cyan' },
        { icon: 'TrendingUp', label: 'Signals', value: 'Behavioural Biometrics', tone: 'violet' },
        { icon: 'Zap', label: 'Speed', value: 'Sub-100ms Scoring', tone: 'brand' },
      ],
    },
    metrics: [
      { value: 'Real time', label: 'Session and transaction scoring' },
      { value: 'Web + mobile', label: 'Device fingerprinting coverage' },
      { value: 'Network-wide', label: 'Shared fraud intelligence' },
    ],
    overview: {
      title: 'Eliminate fraud without adding friction',
      body: 'Difaac establishes a tamper-resistant device identity and watches behavioural signals through the whole session, not at a single checkpoint. Every session and transaction is scored in milliseconds, and your policies decide whether to allow, challenge, or block.',
      capabilities: [
        { title: 'Device fingerprinting', description: 'Identifies devices with persistent, tamper-resistant fingerprints.' },
        { title: 'Behavioural analysis', description: 'Distinguishes human behaviour from automation at the session level.' },
        { title: 'Risk scoring', description: 'Scores every session and transaction against fraud signals in milliseconds.' },
        { title: 'Case management', description: 'Investigation workspace for fraud analysts with full session replay.' },
      ],
    },
    featureGrid: {
      heading: 'Fraud prevention that scales with your business',
      items: [
        { icon: 'Smartphone', title: 'Device Fingerprinting', description: 'Persistent, tamper-resistant device identity across web and mobile.', tone: 'brand' },
        { icon: 'Brain', title: 'Behavioural Analysis', description: 'Separates human interaction from automation at session level.', tone: 'cyan' },
        { icon: 'Zap', title: 'Risk Scoring', description: 'Every session and transaction scored against fraud signals in milliseconds.', tone: 'violet' },
        { icon: 'Lock', title: 'Account Takeover Defence', description: 'Flags unauthorised logins from device and behavioural patterns.', tone: 'brand' },
        { icon: 'CreditCard', title: 'Payment Fraud Prevention', description: 'Challenges only genuinely risky transactions at checkout.', tone: 'cyan' },
        { icon: 'FileText', title: 'Case Management', description: 'Analyst workspace with full session replay and investigation notes.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'Advanced fraud detection technology',
      description: 'Five capabilities working together across the customer journey.',
      items: [
        {
          id: 'device-fingerprinting',
          label: 'Device fingerprinting',
          title: 'Persistent device identification',
          description: 'Tamper-resistant fingerprints established across web and mobile sessions.',
          icon: 'Smartphone',
          details: [
            'Unique device identifiers that persist across sessions',
            'Tamper detection for jailbroken or rooted devices',
            'Cross-device linking for account transitions',
            'Privacy-compliant, no cookies required',
          ],
        },
        {
          id: 'behavioural-analysis',
          label: 'Behavioural analysis',
          title: 'Human versus automation',
          description: 'Continuous behavioural signal collection throughout the session.',
          icon: 'Brain',
          details: [
            'Mouse movement and typing pattern analysis',
            'Touch and gesture analysis on mobile',
            'Navigation and scrolling behaviour',
            'Bot and scripted attack detection',
          ],
        },
        {
          id: 'risk-scoring',
          label: 'Risk scoring',
          title: 'Millisecond fraud decisions',
          description: 'Every session and transaction scored against fraud signals in real time.',
          icon: 'Zap',
          details: [
            'Real-time scoring in under 100 milliseconds',
            'Customisable risk thresholds per application',
            'Velocity and anomaly detection',
            'Contextual assessment per user',
          ],
        },
        {
          id: 'adaptive-auth',
          label: 'Adaptive authentication',
          title: 'Friction only where it is earned',
          description: 'Challenge only when genuine risk is detected.',
          icon: 'Lock',
          details: [
            'Risk-based step-up authentication',
            'Frictionless login from known devices',
            'Multi-factor triggered only when needed',
            'No blanket CAPTCHAs on legitimate traffic',
          ],
        },
        {
          id: 'case-management',
          label: 'Case management',
          title: 'Fraud analyst workspace',
          description: 'Complete investigation tooling with session replay and context.',
          icon: 'FileText',
          details: [
            'Full session replay with timeline scrubbing',
            'Rich case detail and metadata',
            'Annotation and investigation notes',
            'Integration with existing case systems',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Modern fraud prevention versus legacy tooling',
      description: 'Real-time protection that does not tax the customer experience.',
      columns: ['Difaac', 'Legacy', 'Open Source'],
      columnSubs: ['Platform', 'Rules Engines', 'Libraries'],
      rows: [
        { feature: 'Device fingerprinting', values: [true, false, true] },
        { feature: 'Behavioural biometrics', values: [true, false, false] },
        { feature: 'Real-time scoring', values: [true, true, false] },
        { feature: 'Web and mobile coverage', values: [true, true, false] },
        { feature: 'Frictionless authentication', values: [true, false, false] },
        { feature: 'API-based integration', values: [true, true, true] },
        { feature: 'Session replay', values: [true, false, false] },
        { feature: 'Network-wide intelligence', values: [true, false, false] },
      ],
    },
    pillars: {
      eyebrow: 'Three use cases',
      heading: 'Protection across the customer journey',
      description: 'From login through to payment, in one decision layer.',
      items: [
        {
          icon: 'Lock',
          title: 'Stop account takeover',
          description: 'Block unauthorised logins before credentials are abused.',
          details: ['Device-based access control', 'Anomalous login detection', 'Account recovery protection'],
        },
        {
          icon: 'CreditCard',
          title: 'Protect payments',
          description: 'Challenge risky transactions while keeping checkout fast.',
          details: ['Real-time transaction scoring', 'Card-not-present detection', 'Checkout optimisation'],
        },
        {
          icon: 'Bot',
          title: 'Detect bots and abuse',
          description: 'Separate real users from automation and scripted attacks.',
          details: ['Credential stuffing prevention', 'Scraping detection', 'Account abuse prevention'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Fraud Protection',
      heading: 'What changes for your business',
      items: [
        { icon: 'TrendingUp', title: 'Reduce fraud losses', description: 'Stop takeover, payment fraud, and abuse before they hit revenue.' },
        { icon: 'Zap', title: 'Improve conversion', description: 'Frictionless authentication keeps legitimate customers moving.' },
        { icon: 'Users', title: 'Protect customer trust', description: 'Secure accounts without a punishing user experience.' },
        { icon: 'Clock', title: 'Investigate faster', description: 'Session replay and context cut case handling to minutes.' },
        { icon: 'DollarSign', title: 'Cut manual review', description: 'Automated decisions reduce the queue analysts work through.' },
        { icon: 'Target', title: 'Adapt to new fraud', description: 'Models evolve as new techniques appear across the network.' },
      ],
    },
    faqs: [
      {
        question: 'How do you detect fraud without adding friction?',
        answer:
          'Device fingerprinting and behavioural analysis run in the background through the session. Additional verification is requested only when genuine risk is detected, so most users authenticate without friction while fraudsters are blocked.',
      },
      {
        question: 'Is device fingerprinting privacy-compliant?',
        answer:
          'Yes. The implementation does not rely on cookies or personal data and is designed to comply with GDPR, CCPA, and similar regulations. It works across web browsers and native mobile apps.',
      },
      {
        question: 'How fast is a fraud decision?',
        answer:
          'Sessions and transactions are scored in under 100 milliseconds, so legitimate users are never held up waiting on a decision.',
      },
      {
        question: 'Does this work in mobile apps?',
        answer:
          'Yes. SDKs are available for web, iOS, and Android. Fingerprinting and behavioural analysis work across browsers, native apps, and hybrid applications.',
      },
      {
        question: 'What happens if a legitimate customer is flagged?',
        answer:
          'Adaptive authentication means a flagged user sees a quick step-up such as SMS, email, or biometric verification rather than a hard block. Recognised users from known devices see no friction at all.',
      },
      {
        question: 'Can it run alongside our existing fraud tools?',
        answer:
          'Yes. REST APIs and SDKs integrate with common authentication and payment platforms, so Difaac can complement your current stack or replace it outright.',
      },
    ],
    trust: {
      heading: 'Protecting customers at scale',
      description: 'From fintech to marketplaces, fraud teams run their decision layer on Difaac.',
      items: [
        { stat: '<100ms', label: 'Decision time' },
        { stat: 'Web + mobile', label: 'Platform coverage' },
        { stat: '99.99%', label: 'Platform uptime' },
        { stat: 'Real-time', label: 'Risk scoring' },
        { stat: '150+', label: 'Countries supported' },
        { stat: 'Network-wide', label: 'Shared intelligence' },
      ],
    },
    cta: {
      title: 'Ready to eliminate fraud without adding friction?',
      description:
        'Book a demo with a Difaac specialist to see how the decision layer fits your authentication and payment flows.',
    },
  },

  'managed-xdr': {
    hero: {
      badge: 'Extended Detection & Response',
      badgeIcon: 'Activity',
      headlineLead: 'Detect and disrupt ',
      headlineAccent: 'attacks in progress',
      description:
        'Round-the-clock detection and response across endpoint, network, email, and cloud, run by a dedicated analyst team on your behalf.',
      stats: [
        { value: '24/7', label: 'SOC Coverage' },
        { value: '<15 min', label: 'Critical Response' },
        { value: '4 layers', label: 'Telemetry' },
        { value: 'Human-led', label: 'Triage' },
      ],
    },
    band: {
      eyebrow: 'Managed Detection and Response',
      headline: 'Watch. Triage. Contain.',
      description: 'Unified telemetry, human-led triage, and pre-approved containment.',
      cards: [
        { icon: 'Activity', label: 'Monitoring', value: '24/7 Analyst SOC', tone: 'brand' },
        { icon: 'Layers', label: 'Telemetry', value: 'Four Layers Unified', tone: 'cyan' },
        { icon: 'Clock', label: 'Response', value: 'Under 15 Minutes', tone: 'violet' },
        { icon: 'ShieldCheck', label: 'Containment', value: 'Guided Playbooks', tone: 'brand' },
      ],
    },
    metrics: [
      { value: '24/7', label: 'Analyst-staffed SOC' },
      { value: 'Under 15 min', label: 'Response time for critical incidents' },
      { value: 'Four layers', label: 'Endpoint, network, email, and cloud' },
    ],
    overview: {
      title: 'Detect and disrupt attacks in progress',
      body: 'Telemetry from endpoint, network, email, and cloud is unified into a single detection pipeline. Analysts validate every high-confidence detection by hand, so your team receives escalations rather than raw alert queues, and containment runs against playbooks agreed with you in advance.',
      capabilities: [
        { title: 'Unified detection', description: 'Correlates signals across every layer of your environment into one timeline.' },
        { title: '24/7 SOC', description: 'Analysts monitor, triage, and escalate around the clock.' },
        { title: 'Guided response', description: 'Pre-approved playbooks contain threats before they spread.' },
        { title: 'Threat hunting', description: 'Proactive hunts based on the latest adversary tradecraft.' },
      ],
    },
    featureGrid: {
      heading: 'A full detection and response function, operated for you',
      items: [
        { icon: 'Layers', title: 'Unified Telemetry', description: 'Endpoint, network, email, and cloud correlated into one timeline.', tone: 'brand' },
        { icon: 'Users', title: 'Human-led Triage', description: 'Analysts validate every high-confidence detection by hand.', tone: 'cyan' },
        { icon: 'Siren', title: 'Guided Containment', description: 'Pre-approved playbooks isolate hosts and cut attacker access.', tone: 'violet' },
        { icon: 'Search', title: 'Proactive Hunting', description: 'Hypothesis-driven hunts based on current adversary tradecraft.', tone: 'brand' },
        { icon: 'Radar', title: 'Intelligence-informed', description: 'Detections enriched with Difaac threat actor context.', tone: 'cyan' },
        { icon: 'FileText', title: 'Incident Reporting', description: 'Full timeline, root cause, and remediation guidance per incident.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'How Managed XDR operates',
      description: 'Five capabilities that run continuously rather than as a periodic engagement.',
      items: [
        {
          id: 'unified-detection',
          label: 'Unified detection',
          title: 'One timeline across four layers',
          description: 'Signals from every layer of your environment correlated into a single view.',
          icon: 'Layers',
          details: [
            'Endpoint, network, email, and cloud telemetry ingested together',
            'Cross-layer correlation into a single incident timeline',
            'Connectors for tooling you already run',
            'No rip-and-replace of existing agents',
          ],
        },
        {
          id: 'analyst-triage',
          label: 'Analyst triage',
          title: 'Escalations, not alert queues',
          description: 'Every high-confidence detection is validated by a human before it reaches you.',
          icon: 'Users',
          details: [
            'Analysts staffed around the clock including weekends',
            'Manual validation on high-confidence detections',
            'False positives closed before they reach your team',
            'Escalation routed to your ticketing and chat systems',
          ],
        },
        {
          id: 'response',
          label: 'Guided response',
          title: 'Containment while you are still being briefed',
          description: 'Pre-approved playbooks let analysts act inside agreed boundaries.',
          icon: 'Siren',
          details: [
            'Playbooks scoped and approved with your team in advance',
            'Host isolation and account disablement on your behalf',
            'Approval workflows wherever you require them',
            'Full audit trail of every action taken',
          ],
        },
        {
          id: 'threat-hunting',
          label: 'Threat hunting',
          title: 'Look for what detection missed',
          description: 'Hypothesis-driven hunts across your historical telemetry.',
          icon: 'Search',
          details: [
            'Hunts driven by current adversary tradecraft',
            'Retrospective search as new intelligence lands',
            'Findings fed back into detection logic',
            'Hunt reports with evidence and recommendations',
          ],
        },
        {
          id: 'reporting',
          label: 'Reporting',
          title: 'Evidence for every incident',
          description: 'Timelines, root cause, and remediation guidance you can act on.',
          icon: 'FileText',
          details: [
            'Per-incident timeline and root cause analysis',
            'Monthly service and detection coverage reporting',
            'Metrics for mean time to detect and respond',
            'Evidence packages for audit and compliance',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Managed XDR versus the alternatives',
      description: 'Coverage and containment without building a 24/7 SOC yourself.',
      columns: ['Difaac', 'In-house SOC', 'Alert-only MDR'],
      columnSubs: ['Managed XDR', 'Built yourself', 'Notify only'],
      rows: [
        { feature: '24/7 analyst coverage', values: [true, false, true] },
        { feature: 'Cross-layer correlation', values: [true, true, false] },
        { feature: 'Human triage on every alert', values: [true, true, false] },
        { feature: 'Containment on your behalf', values: [true, true, false] },
        { feature: 'Proactive threat hunting', values: [true, false, false] },
        { feature: 'No night and weekend rota', values: [true, false, true] },
        { feature: 'Intelligence-enriched detections', values: [true, false, false] },
        { feature: 'Predictable operating cost', values: [true, false, true] },
      ],
    },
    pillars: {
      eyebrow: 'Three outcomes',
      heading: 'What Managed XDR changes',
      description: 'Coverage, focus, and speed, without hiring for a night shift.',
      items: [
        {
          icon: 'Users',
          title: 'Extend a small team',
          description: 'Round-the-clock coverage without hiring for nights, weekends, and holidays.',
          details: ['24/7 staffed monitoring', 'No rota to manage', 'Surge capacity during incidents'],
        },
        {
          icon: 'Target',
          title: 'Cut alert fatigue',
          description: 'Human triage means your team sees escalations, not raw queues.',
          details: ['Validated detections only', 'False positives closed upstream', 'Context attached to every escalation'],
        },
        {
          icon: 'Siren',
          title: 'Contain intrusions',
          description: 'Pre-approved playbooks cut attacker access while you are briefed.',
          details: ['Host isolation', 'Account containment', 'Full action audit trail'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Managed XDR',
      heading: 'What changes for your SOC',
      items: [
        { icon: 'Clock', title: 'Faster containment', description: 'Under 15 minutes to response on critical incidents.' },
        { icon: 'Users', title: 'Coverage without headcount', description: '24/7 monitoring without staffing a night rota.' },
        { icon: 'DollarSign', title: 'Predictable operating cost', description: 'A staffed capability without the hiring, rota, and tooling spend behind it.' },
        { icon: 'Layers', title: 'One view of the estate', description: 'Endpoint, network, email, and cloud in a single timeline.' },
        { icon: 'Search', title: 'Threats found proactively', description: 'Hunting surfaces intrusions detection logic missed.' },
        { icon: 'FileText', title: 'Audit-ready evidence', description: 'Every incident documented with timeline and root cause.' },
      ],
    },
    faqs: [
      {
        question: 'Do we have to replace our existing security tools?',
        answer:
          'No. Managed XDR ingests telemetry from the endpoint, network, email, and cloud tooling you already run through connectors. There is no requirement to rip out existing agents.',
      },
      {
        question: 'What can your analysts do without asking us first?',
        answer:
          'Only what you have approved. Containment playbooks are scoped with your team during onboarding, and you decide which actions run automatically and which require sign-off. Every action is logged in an audit trail.',
      },
      {
        question: 'How quickly do you respond to a critical incident?',
        answer:
          'Under 15 minutes for critical incidents. Escalations route into the ticketing and chat systems your team already uses, so there is no separate console to watch.',
      },
      {
        question: 'How is this different from an MDR that only sends alerts?',
        answer:
          'Alert-only services hand you a notification and stop. Managed XDR includes human triage before escalation and containment actions taken on your behalf inside agreed boundaries, so the intrusion is disrupted rather than just reported.',
      },
      {
        question: 'Does it work with cloud and hybrid environments?',
        answer:
          'Yes. Cloud telemetry is a first-class source alongside endpoint, network, and email, and correlation works across on-premise and cloud in the same incident timeline.',
      },
      {
        question: 'What reporting do we receive?',
        answer:
          'Per-incident timelines with root cause and remediation guidance, plus monthly reporting on detection coverage, mean time to detect, and mean time to respond.',
      },
    ],
    trust: {
      heading: 'Detection and response, operated at scale',
      description: 'A staffed SOC, unified telemetry, and containment inside boundaries you set.',
      items: [
        { stat: '24/7', label: 'Analyst-staffed SOC' },
        { stat: '<15 min', label: 'Critical response time' },
        { stat: '4 layers', label: 'Telemetry correlated' },
        { stat: '99.99%', label: 'Platform uptime' },
        { stat: 'Human-led', label: 'Triage on detections' },
        { stat: 'Audit trail', label: 'On every action' },
      ],
    },
    cta: {
      title: 'Ready for 24/7 detection and response?',
      description:
        'Book a walkthrough with a Difaac specialist to scope coverage, playbooks, and escalation for your environment.',
    },
  },

  'attack-surface-management': {
    hero: {
      badge: 'Attack Surface Management',
      badgeIcon: 'Globe',
      headlineLead: 'Find what attackers ',
      headlineAccent: 'find first',
      description:
        'Continuously discover external assets, surface exposure, and rank risk across your full digital footprint, without deploying an agent anywhere.',
      stats: [
        { value: 'Agentless', label: 'Discovery' },
        { value: 'Continuous', label: 'Scanning' },
        { value: 'Exploitability', label: 'Ranking' },
        { value: 'Shadow IT', label: 'Surfaced' },
      ],
    },
    band: {
      eyebrow: 'External Attack Surface',
      headline: 'Discover. Assess. Prioritise.',
      description: 'Everything reachable from the internet, mapped and ranked by what is genuinely exploitable.',
      cards: [
        { icon: 'ScanSearch', label: 'Discovery', value: 'Agentless Mapping', tone: 'brand' },
        { icon: 'Boxes', label: 'Assets', value: 'Domains, IPs, Cloud', tone: 'cyan' },
        { icon: 'BarChart3', label: 'Ranking', value: 'Exploitability First', tone: 'violet' },
        { icon: 'Clock', label: 'Cadence', value: 'Continuous Monitoring', tone: 'brand' },
      ],
    },
    metrics: [
      { value: 'Agentless', label: 'No deployment on discovered assets' },
      { value: 'Continuous', label: 'Discovery and exposure scanning' },
      { value: 'Exploitability', label: 'Basis for risk ranking' },
    ],
    overview: {
      title: 'Manage your attack surface continuously',
      body: 'Domains, IP ranges, and cloud assets tied to your organisation are mapped automatically from external signals, then checked for misconfigurations, open ports, and vulnerable services. Findings are ranked by real-world exploitability and business impact, and tracked until they are closed.',
      capabilities: [
        { title: 'Asset discovery', description: 'Maps every external-facing asset tied to your organization.' },
        { title: 'Exposure scanning', description: 'Identifies misconfigurations, open ports, and vulnerable services.' },
        { title: 'Risk prioritization', description: 'Ranks findings by real-world exploitability and business impact.' },
        { title: 'Continuous monitoring', description: 'Detects new and changed assets as they appear.' },
      ],
    },
    featureGrid: {
      heading: 'See your perimeter the way an attacker does',
      items: [
        { icon: 'ScanSearch', title: 'Automated Discovery', description: 'Domains, subdomains, IP ranges, and cloud assets mapped from external signals.', tone: 'brand' },
        { icon: 'Eye', title: 'Shadow IT Detection', description: 'Surfaces forgotten infrastructure that never reached the asset inventory.', tone: 'cyan' },
        { icon: 'Bug', title: 'Exposure Scanning', description: 'Misconfigurations, open ports, and vulnerable services, without agents.', tone: 'violet' },
        { icon: 'BarChart3', title: 'Exploitability Ranking', description: 'Prioritises what an attacker could actually use, not raw CVSS.', tone: 'brand' },
        { icon: 'Boxes', title: 'Acquisition Onboarding', description: 'Brings newly acquired estates under monitoring immediately.', tone: 'cyan' },
        { icon: 'Workflow', title: 'Remediation Tracking', description: 'Findings pushed into your ticketing workflow and tracked to closure.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'How Attack Surface Management works',
      description: 'Five capabilities running continuously across your external estate.',
      items: [
        {
          id: 'discovery',
          label: 'Asset discovery',
          title: 'Map everything facing the internet',
          description: 'External signals reveal the assets tied to your organisation, documented or not.',
          icon: 'ScanSearch',
          details: [
            'Domain, subdomain, and IP range mapping',
            'Cloud asset discovery across providers',
            'Certificate and DNS-based attribution',
            'No agent or network access required',
          ],
        },
        {
          id: 'shadow-it',
          label: 'Shadow IT',
          title: 'Find the assets nobody documented',
          description: 'Forgotten subdomains and legacy infrastructure surfaced automatically.',
          icon: 'Eye',
          details: [
            'Unmanaged and forgotten subdomains',
            'Legacy infrastructure still reachable',
            'Assets from acquisitions and past projects',
            'Third-party hosted services under your brand',
          ],
        },
        {
          id: 'exposure',
          label: 'Exposure scanning',
          title: 'Check every asset for weakness',
          description: 'Misconfigurations, open ports, and vulnerable services identified continuously.',
          icon: 'Bug',
          details: [
            'Open port and exposed service detection',
            'TLS and certificate misconfiguration checks',
            'Known vulnerable software versions',
            'Agentless, no deployment on discovered assets',
          ],
        },
        {
          id: 'prioritisation',
          label: 'Risk ranking',
          title: 'Fix what is genuinely reachable',
          description: 'Findings ranked by exploitability and business impact rather than severity alone.',
          icon: 'BarChart3',
          details: [
            'Ranking driven by real-world exploitation',
            'Business impact weighted by asset criticality',
            'Threat intelligence context on each finding',
            'Clear remediation order for your team',
          ],
        },
        {
          id: 'monitoring',
          label: 'Change monitoring',
          title: 'Catch new exposure as it appears',
          description: 'The perimeter changes constantly, so discovery never stops.',
          icon: 'Clock',
          details: [
            'Alerts when new assets appear',
            'Notification on changed or reopened services',
            'Findings pushed into your ticketing workflow',
            'Tracking from discovery through to closure',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Attack Surface Management versus the alternatives',
      description: 'Continuous external visibility, not a point-in-time snapshot.',
      columns: ['Difaac', 'Vuln Scanner', 'Pen Test'],
      columnSubs: ['Continuous ASM', 'Known assets only', 'Point in time'],
      rows: [
        { feature: 'Discovers unknown assets', values: [true, false, true] },
        { feature: 'Continuous, not periodic', values: [true, true, false] },
        { feature: 'Agentless on discovered assets', values: [true, false, true] },
        { feature: 'Shadow IT detection', values: [true, false, false] },
        { feature: 'Exploitability-based ranking', values: [true, false, true] },
        { feature: 'Alerts on perimeter change', values: [true, false, false] },
        { feature: 'Ticketing integration', values: [true, true, false] },
        { feature: 'Covers new acquisitions', values: [true, false, false] },
      ],
    },
    pillars: {
      eyebrow: 'Three outcomes',
      heading: 'Where teams apply it',
      description: 'Visibility, focus, and coverage as the estate changes.',
      items: [
        {
          icon: 'Eye',
          title: 'Find the undocumented',
          description: 'Surface shadow IT and legacy infrastructure missing from the inventory.',
          details: ['Forgotten subdomains', 'Legacy infrastructure', 'Unmanaged cloud assets'],
        },
        {
          icon: 'BarChart3',
          title: 'Fix what matters',
          description: 'Ranking by exploitability keeps effort on exposures attackers could use.',
          details: ['Real-world exploitation data', 'Business impact weighting', 'Clear remediation order'],
        },
        {
          icon: 'Boxes',
          title: 'Cover new estates',
          description: 'Bring acquisitions under monitoring before migration completes.',
          details: ['Rapid onboarding', 'Immediate exposure baseline', 'Continuous tracking'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Attack Surface Management',
      heading: 'What changes for your team',
      items: [
        { icon: 'Eye', title: 'Know your real perimeter', description: 'Discovery finds assets your inventory never captured.' },
        { icon: 'FileCheck2', title: 'Evidence for auditors', description: 'A continuous record of external monitoring and how exposures were closed.' },
        { icon: 'Clock', title: 'Catch drift immediately', description: 'New and changed assets are flagged as they appear.' },
        { icon: 'ShieldCheck', title: 'No agent rollout', description: 'Discovery and scanning run entirely from outside.' },
        { icon: 'Workflow', title: 'Fits your workflow', description: 'Findings route into the ticketing system your team already uses.' },
        { icon: 'ShieldAlert', title: 'Fewer surprise disclosures', description: 'Find the exposure before a researcher or an attacker reports it for you.' },
      ],
    },
    faqs: [
      {
        question: 'Do we need to install anything on the discovered assets?',
        answer:
          'No. Discovery and exposure scanning run entirely externally, which is what allows the platform to find assets your team does not know about. There is no agent to deploy and no network access required.',
      },
      {
        question: 'How do you know which assets belong to us?',
        answer:
          'Attribution is built from external signals such as DNS records, certificate data, IP range ownership, and infrastructure relationships. You confirm the scope during onboarding and can add or exclude assets at any time.',
      },
      {
        question: 'How is this different from a vulnerability scanner?',
        answer:
          'A vulnerability scanner checks assets you already have in an inventory. Attack Surface Management finds the assets that are missing from that inventory first, then assesses them, which is where most unmanaged exposure lives.',
      },
      {
        question: 'How does exploitability ranking work?',
        answer:
          'Findings are ranked using real-world exploitation activity and threat intelligence context, weighted by how critical the affected asset is to your business, rather than relying on CVSS severity alone.',
      },
      {
        question: 'How quickly are new assets detected?',
        answer:
          'Discovery runs continuously rather than on a scan schedule, so newly registered domains, spun-up cloud resources, and reopened services are flagged as they appear.',
      },
      {
        question: 'Can it cover companies we acquire?',
        answer:
          'Yes. A newly acquired estate can be scoped and brought under monitoring immediately, giving you an exposure baseline before the infrastructure is migrated into your standard controls.',
      },
    ],
    trust: {
      heading: 'External risk, reduced at scale',
      description: 'Continuous discovery and ranking across the whole internet-facing estate.',
      items: [
        { stat: 'Agentless', label: 'Discovery model' },
        { stat: 'Continuous', label: 'Scanning cadence' },
        { stat: 'Exploitability', label: 'Ranking basis' },
        { stat: '99.99%', label: 'Platform uptime' },
        { stat: 'Shadow IT', label: 'Surfaced automatically' },
        { stat: 'Ticketing', label: 'Workflow integration' },
      ],
    },
    cta: {
      title: 'Ready to see your real attack surface?',
      description:
        'Book a walkthrough to discover the external assets and exposures your inventory is missing today.',
    },
  },

  'digital-risk-protection': {
    hero: {
      badge: 'Digital Risk Protection',
      badgeIcon: 'Fingerprint',
      headlineLead: 'Protect your brand ',
      headlineAccent: 'across the web',
      description:
        'Detection and takedown of phishing, impersonation, and brand abuse across the open, deep, and dark web, run by an in-house takedown team.',
      stats: [
        { value: 'Minutes', label: 'To Detection' },
        { value: 'In-house', label: 'Takedown Team' },
        { value: 'Open/Deep/Dark', label: 'Coverage' },
        { value: '24/7', label: 'Monitoring' },
      ],
    },
    band: {
      eyebrow: 'Brand and Digital Risk',
      headline: 'Detect. Validate. Take down.',
      description: 'Impersonation found within minutes of registration and pursued to removal.',
      cards: [
        { icon: 'Globe', label: 'Monitoring', value: 'Open, Deep, Dark', tone: 'cyan' },
        { icon: 'MailWarning', label: 'Phishing', value: 'Minutes to Detect', tone: 'brand' },
        { icon: 'Swords', label: 'Takedown', value: 'In-house Team', tone: 'violet' },
        { icon: 'Users', label: 'Executives', value: 'Impersonation Watch', tone: 'brand' },
      ],
    },
    metrics: [
      { value: 'Minutes', label: 'From registration to phishing detection' },
      { value: 'In-house', label: 'Takedown operations team' },
      { value: 'Open, deep, dark', label: 'Web monitoring coverage' },
    ],
    overview: {
      title: 'Protect your brand across the open, deep, and dark web',
      body: 'Domain registrations, marketplaces, social platforms, and dark web sources are watched continuously for your brand. Detections are reviewed so takedown effort goes to genuine impersonation, then an in-house team pursues removal through direct registrar, host, and platform relationships.',
      capabilities: [
        { title: 'Domain monitoring', description: 'Flags typosquats and lookalike domains as they are registered.' },
        { title: 'Takedown operations', description: 'In-house takedown team with direct registrar and host relationships.' },
        { title: 'Brand monitoring', description: 'Scans marketplaces and social platforms for unauthorized use.' },
        { title: 'Executive protection', description: 'Monitors for impersonation and exposure of key personnel.' },
      ],
    },
    featureGrid: {
      heading: 'Cover every channel your brand appears on',
      items: [
        { icon: 'MailWarning', title: 'Phishing Detection', description: 'Lookalike domains flagged within minutes of registration.', tone: 'brand' },
        { icon: 'Swords', title: 'Takedown Operations', description: 'In-house team with direct registrar and host relationships.', tone: 'violet' },
        { icon: 'ShoppingCart', title: 'Marketplace Monitoring', description: 'Counterfeit listings and unauthorised sellers detected across platforms.', tone: 'cyan' },
        { icon: 'Users', title: 'Executive Protection', description: 'Impersonation, doxxing, and leaked personal data on named individuals.', tone: 'brand' },
        { icon: 'Eye', title: 'Dark Web Coverage', description: 'Closed forums and marketplaces watched for mentions of your brand.', tone: 'cyan' },
        { icon: 'ClipboardCheck', title: 'Case Tracking', description: 'Every detection tracked from validation to confirmed removal.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'How Digital Risk Protection works',
      description: 'Five capabilities from first detection through to confirmed takedown.',
      items: [
        {
          id: 'domain-monitoring',
          label: 'Domain monitoring',
          title: 'Catch phishing at registration',
          description: 'Typosquats and lookalike domains flagged as they are registered.',
          icon: 'MailWarning',
          details: [
            'Newly registered lookalike and typosquat domains',
            'Certificate transparency monitoring',
            'Live phishing page detection and capture',
            'Alerting before a campaign reaches customers',
          ],
        },
        {
          id: 'brand-monitoring',
          label: 'Brand monitoring',
          title: 'Watch marketplaces and social',
          description: 'Unauthorised use of your brand detected across platforms.',
          icon: 'ShoppingCart',
          details: [
            'Counterfeit listings on major marketplaces',
            'Unauthorised seller and reseller detection',
            'Social media impersonation accounts',
            'Logo and trademark misuse',
          ],
        },
        {
          id: 'executive-protection',
          label: 'Executive protection',
          title: 'Defend named individuals',
          description: 'Monitoring for impersonation and exposure of key personnel.',
          icon: 'Users',
          details: [
            'Executive impersonation accounts and profiles',
            'Leaked personal data and doxxing attempts',
            'Targeted harassment monitoring',
            'Scoped to the individuals you nominate',
          ],
        },
        {
          id: 'validation',
          label: 'Validation',
          title: 'Effort goes to real threats',
          description: 'Detections are reviewed before takedown effort is spent.',
          icon: 'ClipboardCheck',
          details: [
            'Human review of every detection',
            'False matches filtered before escalation',
            'Evidence captured for the takedown request',
            'Severity assessment on each case',
          ],
        },
        {
          id: 'takedown',
          label: 'Takedown',
          title: 'Pursued to confirmed removal',
          description: 'An in-house team works registrars, hosts, and platforms directly.',
          icon: 'Swords',
          details: [
            'Direct registrar, host, and platform relationships',
            'Case tracking from detection to removal',
            'Escalation paths for non-responsive hosts',
            'Confirmation and evidence on closure',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Digital Risk Protection versus the alternatives',
      description: 'Detection is only half the job. Removal is the other half.',
      columns: ['Difaac', 'Monitoring Only', 'Manual Process'],
      columnSubs: ['Detect + take down', 'Alerts you', 'Your team files'],
      rows: [
        { feature: 'Phishing domain detection', values: [true, true, false] },
        { feature: 'In-house takedown team', values: [true, false, false] },
        { feature: 'Human validation before action', values: [true, false, true] },
        { feature: 'Marketplace counterfeit coverage', values: [true, true, false] },
        { feature: 'Dark web monitoring', values: [true, false, false] },
        { feature: 'Executive impersonation watch', values: [true, false, false] },
        { feature: 'Case tracking to removal', values: [true, false, false] },
        { feature: 'Direct registrar relationships', values: [true, false, false] },
      ],
    },
    pillars: {
      eyebrow: 'Three outcomes',
      heading: 'Where teams apply it',
      description: 'Phishing, counterfeits, and the people who represent your brand.',
      items: [
        {
          icon: 'MailWarning',
          title: 'Shut down phishing',
          description: 'Lookalike domains moved into takedown before customers are reached.',
          details: ['Detection at registration', 'Evidence capture', 'Takedown pursued to removal'],
        },
        {
          icon: 'ShoppingCart',
          title: 'Defend the brand',
          description: 'Counterfeits and unauthorised use detected across marketplaces and social.',
          details: ['Counterfeit listings', 'Unauthorised sellers', 'Trademark misuse'],
        },
        {
          icon: 'Users',
          title: 'Protect executives',
          description: 'Impersonation, leaked data, and targeted harassment monitoring.',
          details: ['Fake executive profiles', 'Leaked personal data', 'Harassment campaigns'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Digital Risk Protection',
      heading: 'What changes for your brand',
      items: [
        { icon: 'Clock', title: 'Detection in minutes', description: 'Lookalike domains flagged as they are registered, not after a campaign lands.' },
        { icon: 'Swords', title: 'Removal, not just alerts', description: 'An in-house team pursues takedown through to confirmation.' },
        { icon: 'Target', title: 'Effort spent on real threats', description: 'Human validation filters false matches before escalation.' },
        { icon: 'Globe', title: 'Coverage beyond the open web', description: 'Deep and dark web sources included as standard.' },
        { icon: 'Scale', title: 'Less load on legal', description: 'Direct registrar and platform relationships mean your team is not filing notices.' },
        { icon: 'ClipboardCheck', title: 'Auditable case history', description: 'Every case tracked from detection through to confirmed removal.' },
      ],
    },
    faqs: [
      {
        question: 'How fast are phishing domains detected?',
        answer:
          'Lookalike and typosquat domains are typically flagged within minutes of registration, using domain registration feeds and certificate transparency monitoring, which is well before most campaigns go live.',
      },
      {
        question: 'Do you actually remove the content or just alert us?',
        answer:
          'An in-house takedown team pursues removal directly with registrars, hosting providers, and platforms. Cases are tracked from detection through to confirmed removal rather than handed back to your team as an alert.',
      },
      {
        question: 'How long does a takedown take?',
        answer:
          'It varies by host and jurisdiction. Cooperative registrars and major platforms are often same-day, while non-responsive hosts require escalation. Every case is tracked with its current status so you always know where it stands.',
      },
      {
        question: 'What do you monitor beyond domains?',
        answer:
          'Marketplaces for counterfeit listings and unauthorised sellers, social platforms for impersonation accounts, and closed dark web forums and marketplaces for mentions of your brand and data.',
      },
      {
        question: 'How does executive protection work?',
        answer:
          'You nominate the individuals to cover during onboarding. The platform then monitors for impersonation accounts, leaked personal data, doxxing attempts, and targeted harassment involving those people.',
      },
      {
        question: 'How do you avoid wasting effort on false matches?',
        answer:
          'Every detection is reviewed by an analyst before takedown effort is spent, so requests go to genuine impersonation and abuse rather than legitimate mentions of your brand.',
      },
    ],
    trust: {
      heading: 'Brand protection that ends in removal',
      description: 'Detection, validation, and takedown handled as one workflow.',
      items: [
        { stat: 'Minutes', label: 'Phishing detection' },
        { stat: 'In-house', label: 'Takedown team' },
        { stat: 'Open/Deep/Dark', label: 'Web coverage' },
        { stat: '24/7', label: 'Monitoring' },
        { stat: '150+', label: 'Countries covered' },
        { stat: 'Case tracked', label: 'To confirmed removal' },
      ],
    },
    cta: {
      title: 'Ready to protect your brand online?',
      description:
        'Book a demo to see how Difaac detects and removes impersonation targeting your organisation.',
    },
  },

  'business-email-protection': {
    hero: {
      badge: 'Business Email Protection',
      badgeIcon: 'Mail',
      headlineLead: 'Stop email threats ',
      headlineAccent: 'before they land',
      description:
        'Detonation and retroactive hunting that catch what the gateway missed, including business email compromise with no payload at all.',
      stats: [
        { value: 'Sandboxed', label: 'Detonation' },
        { value: 'Payload-free', label: 'BEC Detection' },
        { value: 'API-based', label: 'Deployment' },
        { value: 'Retroactive', label: 'Hunting' },
      ],
    },
    band: {
      eyebrow: 'Advanced Email Security',
      headline: 'Detonate. Detect. Hunt.',
      description: 'Isolated execution before delivery and continuous re-scanning after it.',
      cards: [
        { icon: 'Bug', label: 'Detonation', value: 'Isolated Sandbox', tone: 'brand' },
        { icon: 'ShieldAlert', label: 'BEC', value: 'No Payload Needed', tone: 'violet' },
        { icon: 'Search', label: 'Hunting', value: 'Retroactive Re-scan', tone: 'cyan' },
        { icon: 'Zap', label: 'Deployment', value: 'API, No Rerouting', tone: 'brand' },
      ],
    },
    metrics: [
      { value: 'Sandboxed', label: 'Attachment and link detonation' },
      { value: 'Payload-free', label: 'Business email compromise detection' },
      { value: 'API-based', label: 'Deployment without mail rerouting' },
    ],
    overview: {
      title: 'Stop email threats before they reach the inbox',
      body: 'Suspicious attachments and embedded links are executed in isolation before they reach a mailbox, exposing behaviour that static scanning and reputation checks do not see. Delivered mail is continuously re-scanned, so threats identified later can be pulled back from inboxes.',
      capabilities: [
        { title: 'Threat detonation', description: 'Executes suspicious content in isolated environments before delivery.' },
        { title: 'BEC detection', description: 'Identifies impersonation and social engineering without relying on payloads.' },
        { title: 'Retroactive hunting', description: 'Re-scans delivered mail as new intelligence emerges.' },
        { title: 'Seamless deployment', description: 'API-based integration with existing mail infrastructure.' },
      ],
    },
    featureGrid: {
      heading: 'Catch what gateways and reputation checks miss',
      items: [
        { icon: 'Bug', title: 'Attachment Detonation', description: 'Files executed in an isolated environment before delivery.', tone: 'brand' },
        { icon: 'Link2', title: 'Link Analysis', description: 'Embedded URLs followed and rendered ahead of the user clicking.', tone: 'cyan' },
        { icon: 'ShieldAlert', title: 'BEC Detection', description: 'Impersonation and social engineering caught without a payload.', tone: 'violet' },
        { icon: 'Search', title: 'Retroactive Hunting', description: 'Delivered mail re-scanned as new intelligence emerges.', tone: 'brand' },
        { icon: 'Zap', title: 'API Deployment', description: 'Integrates without touching MX records or mail routing.', tone: 'cyan' },
        { icon: 'Radar', title: 'Intelligence-informed', description: 'Detection enriched with Difaac threat actor and campaign data.', tone: 'violet' },
      ],
    },
    tabs: {
      heading: 'How Business Email Protection works',
      description: 'Five capabilities covering mail before and after delivery.',
      items: [
        {
          id: 'detonation',
          label: 'Detonation',
          title: 'Execute before the user does',
          description: 'Suspicious attachments run in isolation ahead of delivery.',
          icon: 'Bug',
          details: [
            'Attachments executed in an isolated sandbox',
            'Behavioural analysis rather than signature matching',
            'Detects malware that evades static scanning',
            'Verdict returned before the mail reaches the inbox',
          ],
        },
        {
          id: 'link-analysis',
          label: 'Link analysis',
          title: 'Follow the URL first',
          description: 'Embedded links are followed and rendered before the user clicks.',
          icon: 'Link2',
          details: [
            'Redirect chains followed to the final destination',
            'Credential harvesting pages identified',
            'Detection of links weaponised after delivery',
            'Rendered page evidence captured for review',
          ],
        },
        {
          id: 'bec',
          label: 'BEC detection',
          title: 'Catch fraud with no payload',
          description: 'Impersonation identified from message context, not attachments.',
          icon: 'ShieldAlert',
          details: [
            'Display name and domain impersonation detection',
            'Invoice, payroll, and wire fraud patterns',
            'Thread hijacking and reply-chain abuse',
            'No attachment or link required to detect',
          ],
        },
        {
          id: 'retro-hunting',
          label: 'Retroactive hunting',
          title: 'Re-examine what already landed',
          description: 'Historical mail flow re-scanned as intelligence is updated.',
          icon: 'Search',
          details: [
            'Continuous re-scan of delivered mail',
            'Threats pulled back from inboxes after the fact',
            'Search across historical mail flow',
            'Impact assessment on who received what',
          ],
        },
        {
          id: 'deployment',
          label: 'Deployment',
          title: 'No change to mail routing',
          description: 'API integration leaves MX records and routing untouched.',
          icon: 'Zap',
          details: [
            'API-based integration with your mail platform',
            'No MX record or routing changes required',
            'Runs alongside an existing secure email gateway',
            'Deployment measured in hours, not weeks',
          ],
        },
      ],
    },
    comparison: {
      heading: 'Business Email Protection versus the alternatives',
      description: 'Depth on the threats that get past reputation and signature checks.',
      columns: ['Difaac', 'Native Filter', 'Legacy Gateway'],
      columnSubs: ['API-based', 'Built into mail', 'MX rerouting'],
      rows: [
        { feature: 'Attachment detonation', values: [true, false, true] },
        { feature: 'Link rendering before click', values: [true, false, true] },
        { feature: 'Payload-free BEC detection', values: [true, false, false] },
        { feature: 'Retroactive hunting', values: [true, false, false] },
        { feature: 'No MX or routing change', values: [true, true, false] },
        { feature: 'Runs alongside existing gateway', values: [true, true, false] },
        { feature: 'Threat intelligence enrichment', values: [true, false, false] },
        { feature: 'Pull-back from delivered inboxes', values: [true, false, false] },
      ],
    },
    pillars: {
      eyebrow: 'Three outcomes',
      heading: 'Where teams apply it',
      description: 'The threats that survive the gateway and the ones that already landed.',
      items: [
        {
          icon: 'Bug',
          title: 'Catch what the gateway missed',
          description: 'Detonation exposes behaviour static scanning cannot see.',
          details: ['Isolated execution', 'Behavioural verdicts', 'Evasive malware detection'],
        },
        {
          icon: 'ShieldAlert',
          title: 'Stop invoice and payroll fraud',
          description: 'Impersonation detected from context, not from an attachment.',
          details: ['Display name spoofing', 'Thread hijacking', 'Wire fraud patterns'],
        },
        {
          icon: 'Search',
          title: 'Re-examine delivered mail',
          description: 'Retroactive hunting surfaces threats that landed earlier.',
          details: ['Continuous re-scan', 'Inbox pull-back', 'Historical impact assessment'],
        },
      ],
    },
    benefits: {
      eyebrow: 'Why Difaac Business Email Protection',
      heading: 'What changes for your mail security',
      items: [
        { icon: 'Bug', title: 'Evasive malware caught', description: 'Detonation finds what signature and reputation checks miss.' },
        { icon: 'Users', title: 'No reliance on user vigilance', description: 'Detection does not depend on staff spotting a convincing impersonation.' },
        { icon: 'FileText', title: 'Evidence per message', description: 'Detonation reports give responders the detail to scope an incident quickly.' },
        { icon: 'Zap', title: 'Deploys in hours', description: 'API integration with no MX or routing change.' },
        { icon: 'Layers', title: 'Layers on what you have', description: 'Runs alongside an existing gateway rather than replacing it.' },
        { icon: 'Radar', title: 'Intelligence-enriched', description: 'Detection informed by Difaac actor and campaign data.' },
      ],
    },
    faqs: [
      {
        question: 'Do we have to change our mail routing or MX records?',
        answer:
          'No. Integration is API-based with your existing mail platform, so MX records and routing stay exactly as they are. Deployment is typically measured in hours.',
      },
      {
        question: 'Can it run alongside our current email gateway?',
        answer:
          'Yes. Most customers keep their existing gateway and layer Difaac on top to catch what reputation and signature-based filtering misses, particularly payload-free BEC.',
      },
      {
        question: 'How do you detect business email compromise with no attachment or link?',
        answer:
          'BEC is identified from message context rather than payload: display name and domain impersonation, reply-chain and thread hijacking, and the language patterns typical of invoice, payroll, and wire fraud.',
      },
      {
        question: 'What is retroactive hunting?',
        answer:
          'Mail that has already been delivered is continuously re-scanned as new intelligence emerges. When something that landed earlier is later identified as malicious, it can be pulled back from the inboxes that received it.',
      },
      {
        question: 'What happens during detonation, and does it delay mail?',
        answer:
          'Suspicious attachments and links are executed and rendered in an isolated environment, and a behavioural verdict is returned before delivery. Only suspicious items are detonated, so normal mail flow is not held up.',
      },
      {
        question: 'Does it work with Microsoft 365 and Google Workspace?',
        answer:
          'Yes. Integration is through the mail platform API, which covers the major cloud mail providers without changes to your existing configuration.',
      },
    ],
    trust: {
      heading: 'Email security with depth where it counts',
      description: 'Detonation, context-based BEC detection, and hunting after delivery.',
      items: [
        { stat: 'Sandboxed', label: 'Detonation environment' },
        { stat: 'Payload-free', label: 'BEC detection' },
        { stat: 'API-based', label: 'Deployment model' },
        { stat: 'Retroactive', label: 'Mail re-scanning' },
        { stat: '99.99%', label: 'Platform uptime' },
        { stat: 'Hours', label: 'Time to deploy' },
      ],
    },
    cta: {
      title: 'Ready to stop advanced email threats?',
      description:
        'Book a demo to see what detonation and retroactive hunting surface in your own mail flow.',
    },
  },
}

export function getProductPage(slug: string | undefined): ProductPageContent | undefined {
  return slug ? productPages[slug] : undefined
}
