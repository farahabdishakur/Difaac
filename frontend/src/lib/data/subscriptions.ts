export type SubscriptionTier = {
  id: string
  name: string
  tagline: string
  idealFor: string
  popular?: boolean
  badge?: string
  features: string[]
  highlights: string[]
}

export type MatrixRow = {
  title: string
  description?: string
  tierValues: (boolean | string)[]
}

export type MatrixCategory = {
  name: string
  rows: MatrixRow[]
}

export type ProductSubscription = {
  slug: string
  name: string
  icon: string
  tagline: string
  description: string
  tiers: SubscriptionTier[]
  matrix: MatrixCategory[]
  faqs: { question: string; answer: string }[]
}

export const productSubscriptions: Record<string, ProductSubscription> = {
  'managed-xdr': {
    slug: 'managed-xdr',
    name: 'Managed XDR',
    icon: 'Activity',
    tagline: 'Continuous 24/7 detection, investigation, and guided threat containment across endpoints, cloud, and network.',
    description: 'Protect your enterprise with a hybrid SOC approach combining proprietary Difaac telemetry and elite cyber defense analysts.',
    tiers: [
      {
        id: 'essentials',
        name: 'Essentials',
        tagline: 'Foundational Telemetry & Detection',
        idealFor: 'Mid-market teams with internal responders needing unified telemetry and automated alert filtering.',
        features: [
          'Endpoint & Cloud workload telemetry ingestion',
          'Automated correlation with MITRE ATT&CK mapping',
          'Business-hours (8x5) triage & escalation',
          'Standard detection rules and IOC enrichment',
          'Weekly security health reports',
        ],
        highlights: ['8x5 Analyst Support', 'Automated Triage', 'Standard Telemetry'],
      },
      {
        id: 'advanced',
        name: 'Advanced MXDR',
        tagline: '24/7 Managed SOC & Rapid Response',
        idealFor: 'Enterprises needing around-the-clock threat hunting, sub-15 minute SLAs, and guided containment.',
        popular: true,
        badge: 'Most Popular',
        features: [
          '24/7/365 Human-led SOC monitoring & triage',
          '< 15 min Mean Time to Respond (MTTR) for critical incidents',
          'Proactive adversary threat hunting by Difaac analysts',
          'Direct containment playbooks (host isolation, credential freeze)',
          'Automated STIX/TAXII threat feed ingestion',
          'Dedicated Threat Analyst & quarterly strategy reviews',
        ],
        highlights: ['24/7/365 SOC Monitoring', '<15 min Response SLA', 'Active Threat Hunting', 'Guided Containment'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Elite',
        tagline: 'Full Mission Assurance & DFIR Integration',
        idealFor: 'Critical infrastructure, banking, and global organizations requiring dedicated CSIRT operations.',
        features: [
          'Everything in Advanced MXDR plus:',
          'Dedicated CSIRT Lead and senior DFIR investigator',
          'Custom adversary detection rule engineering & tuning',
          'Included Incident Response Retainer engagement hours',
          'Dark web actor infrastructure tracking and deep attribution',
          'Executive briefings and board-level threat intelligence summaries',
        ],
        highlights: ['Dedicated CSIRT Lead', 'Included DFIR Retainer', 'Custom Detection Engineering', 'Deep Dark Web Attribution'],
      },
    ],
    matrix: [
      {
        name: 'Telemetry & Detection Scope',
        rows: [
          { title: 'Endpoint Telemetry (Windows, Linux, macOS)', tierValues: [true, true, true] },
          { title: 'Cloud Infrastructure (AWS, Azure, GCP)', tierValues: ['Standard', 'Full Telemetry', 'Full Telemetry + Custom Rules'] },
          { title: 'Identity & Active Directory Monitoring', tierValues: [false, true, true] },
          { title: 'Network Flow & Sensor Integration', tierValues: [false, true, true] },
          { title: 'Custom Log Ingestion & SIEM Connector', tierValues: ['Standard APIs', 'STIX/TAXII + SIEM', 'Unlimited Connectors'] },
        ],
      },
      {
        name: 'SOC Operations & SLAs',
        rows: [
          { title: 'Monitoring Coverage', tierValues: ['8x5 Business Hours', '24/7/365 Continuous', '24/7/365 Dedicated'] },
          { title: 'Critical Alert Triage SLA', tierValues: ['< 1 hour', '< 15 minutes', '< 10 minutes'] },
          { title: 'Human-led Expert Verification', tierValues: [false, true, true] },
          { title: 'Containment Actions (Host Isolation, Account Lock)', tierValues: ['Guided / Manual', 'Pre-approved Automated', 'Immediate Direct CSIRT'] },
          { title: 'Proactive Threat Hunting Campaigns', tierValues: ['Quarterly', 'Continuous Weekly', 'Continuous Bespoke'] },
        ],
      },
      {
        name: 'Threat Intelligence & Research',
        rows: [
          { title: 'Adversary MITRE ATT&CK Mapping', tierValues: [true, true, true] },
          { title: 'Real-time Difaac Threat Feeds', tierValues: ['Basic IOCs', 'Full Intel Graph', 'Full Intel Graph + Dark Web'] },
          { title: 'Threat Actor Attribution', tierValues: [false, true, true] },
          { title: 'Dark Web Forum Monitoring & Actor Infiltration', tierValues: [false, false, true] },
        ],
      },
      {
        name: 'Support & Governance',
        rows: [
          { title: 'Designated Technical Account Manager', tierValues: [false, true, true] },
          { title: 'Emergency DFIR Retainer Service', tierValues: ['On-Demand Pricing', 'Priority Standby', 'Included Retainer Credits'] },
          { title: 'Executive Threat Briefings', tierValues: ['Annual Report', 'Quarterly Briefing', 'Monthly C-Level Briefings'] },
          { title: 'Compliance & Audit Reporting (SOC2, ISO27001, PCI-DSS)', tierValues: ['Standard Reports', 'Custom Mappings', 'Dedicated Auditor Support'] },
        ],
      },
    ],
    faqs: [
      {
        question: 'How quickly can Difaac Managed XDR be deployed?',
        answer: 'Our cloud-native platform deploys in hours. Lightweight sensor agents and API-based cloud telemetry connectors integrate seamlessly with zero operational disruption.',
      },
      {
        question: 'Can Difaac co-exist with our existing SIEM or EDR?',
        answer: 'Yes. Difaac MXDR is telemetry-agnostic. We can ingest feeds from your current SIEM, Microsoft Defender, CrowdStrike, SentinelOne, and cloud logs, providing unified correlation without requiring rip-and-replace.',
      },
      {
        question: 'What happens when a critical threat is identified at 3:00 AM?',
        answer: 'Our 24/7 SOC analysts immediately verify the signal within 15 minutes, execute pre-authorized containment steps (such as host isolation or token revocation), and escalate with clear remediation context.',
      },
      {
        question: 'Can we customize the containment playbooks?',
        answer: 'Absolutely. During onboarding, our team establishes customized Rules of Engagement (ROE) tailored to your mission-critical servers and operational tolerances.',
      },
    ],
  },
  'threat-intelligence': {
    slug: 'threat-intelligence',
    name: 'Threat Intelligence',
    icon: 'Radar',
    tagline: 'Understand adversaries, their infrastructure, and campaigns before they strike your perimeter.',
    description: 'Gain direct access to 700+ adversary profiles, zero-day vulnerabilities, and real-time STIX/TAXII threat feeds.',
    tiers: [
      {
        id: 'essentials',
        name: 'Standard Feeds',
        tagline: 'Automated IOC Feeds & Indicators',
        idealFor: 'Security teams seeking high-fidelity indicator lists for direct ingestion into firewalls, SIEM, and SOAR.',
        features: [
          'High-confidence IP, Domain, and Hash blocklists',
          'STIX/TAXII 2.1 API delivery',
          'MITRE ATT&CK technique classification',
          'Standard regional threat landscape updates',
        ],
        highlights: ['STIX/TAXII APIs', 'Automated Blocklists', 'High Confidence'],
      },
      {
        id: 'advanced',
        name: 'Intelligence Suite',
        tagline: 'Actor Profiling & Dark Web Visibility',
        idealFor: 'SOC and Threat Intelligence teams that need campaign attribution, actor tracking, and dark web insights.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Access to 700+ tracked nation-state & criminal actor groups',
          'Continuous dark web marketplace and illicit channel crawling',
          'Interactive threat graph visualization & pivoting workspace',
          'Sector and geography-specific threat alerts',
          'YARA, Sigma, and Snort detection rules included',
        ],
        highlights: ['700+ Actor Profiles', 'Dark Web Crawling', 'YARA/Sigma Rules', 'Graph Investigation'],
      },
      {
        id: 'enterprise',
        name: 'Bespoke Strategic Intel',
        tagline: 'Custom Collection & Dedicated Analyst Access',
        idealFor: 'Government agencies, defense contractors, and large multi-national financial organizations.',
        features: [
          'Everything in Intelligence Suite plus:',
          'Direct access to Difaac Principal Threat Researchers',
          'Targeted threat collection scoped specifically to your brand & supply chain',
          'Bespoke threat actor infrastructure takedown assistance',
          'Early zero-day vulnerability intelligence briefings',
        ],
        highlights: ['Dedicated Intel Analyst', 'Custom RFIs', 'Zero-Day Early Warnings', 'Takedown Assistance'],
      },
    ],
    matrix: [
      {
        name: 'Intelligence Feeds & Integrations',
        rows: [
          { title: 'IOC Delivery (STIX / TAXII / REST API)', tierValues: [true, true, true] },
          { title: 'Confidence Scoring & False-Positive Filtering', tierValues: [true, true, true] },
          { title: 'YARA and Sigma Rule Repository', tierValues: ['Standard', 'Full Access', 'Custom-Authored Rules'] },
          { title: 'SIEM / SOAR / TIP Connectors', tierValues: ['Standard API', 'Pre-built Plugins', 'Custom Integrations'] },
        ],
      },
      {
        name: 'Adversary Tracking & Attribution',
        rows: [
          { title: 'Tracked Threat Actor Dossiers', tierValues: ['Basic Profiles', '700+ Groups with TTPs', '700+ Groups + Active Infrastructure Tracking'] },
          { title: 'Dark Web Marketplace Infiltration', tierValues: [false, true, true] },
          { title: 'Campaign & Infrastructure Attribution Graph', tierValues: [false, true, true] },
          { title: 'Bespoke Requests for Information (RFIs)', tierValues: [false, '2 / quarter', 'Unlimited Priority RFIs'] },
        ],
      },
    ],
    faqs: [
      {
        question: 'How is Difaac Threat Intelligence gathered?',
        answer: 'Our intelligence combines global sensor telemetry, proprietary honeypot networks, high-tech crime investigations, and automated deep/dark web indexing across closed communication channels.',
      },
      {
        question: 'Can we integrate Difaac feeds with Splunk, Microsoft Sentinel, or QRadar?',
        answer: 'Yes. We provide native STIX/TAXII 2.1 interfaces and pre-built integrations for all industry-leading SIEM, SOAR, and TIP systems.',
      },
    ],
  },
  'fraud-protection': {
    slug: 'fraud-protection',
    name: 'Fraud Protection',
    icon: 'ShieldCheck',
    tagline: 'Real-time client-side session security, behavioral biometrics, and anti-account takeover.',
    description: 'Stop bots, payment fraud, and account takeovers without introducing friction for legitimate customers.',
    tiers: [
      {
        id: 'essentials',
        name: 'Bot & Session Defense',
        tagline: 'Device Fingerprinting & Bot Filtering',
        idealFor: 'Online services and e-commerce platforms seeking frictionless bot detection.',
        features: [
          'Cross-platform device fingerprinting (Web & Mobile)',
          'Behavioral biometric analysis (mouse dynamics, keystrokes)',
          'Proxy, VPN, and TOR exit node detection',
          'Standard transaction risk scoring API',
        ],
        highlights: ['Device Fingerprint', 'Biometric Analysis', 'Proxy/VPN Detection'],
      },
      {
        id: 'advanced',
        name: 'Account & Payment Shield',
        tagline: 'Real-Time ATO & Transaction Risk Scoring',
        idealFor: 'Fintechs, banks, and retailers preventing credential stuffing and payment fraud.',
        popular: true,
        badge: 'Top Choice',
        features: [
          'Full Account Takeover (ATO) defense & credential stuffing block',
          'Real-time scoring at login, checkout, and account settings update',
          'Fraud analyst investigation workspace with session replay',
          'Difaac global fraud ring intelligence network sharing',
        ],
        highlights: ['Real-time ATO Shield', 'Session Replay Workspace', 'Global Fraud Ring Intel'],
      },
      {
        id: 'enterprise',
        name: 'Financial Fusion Platform',
        tagline: 'Coordinated Ring Defense & Law Enforcement Evidence',
        idealFor: 'Tier-1 banks, payment processors, and high-volume transaction networks.',
        features: [
          'Everything in Account & Payment Shield plus:',
          'Mule account network graph analysis & detection',
          'Structured evidence packaging for law enforcement referral',
          'Custom machine learning models tuned to your transactional flow',
          'Dedicated fraud operations consultant',
        ],
        highlights: ['Mule Network Graph', 'Legal Evidence Export', 'Custom ML Tuning'],
      },
    ],
    matrix: [
      {
        name: 'Detection Capabilities',
        rows: [
          { title: 'Device Fingerprinting & Browser Integrity', tierValues: [true, true, true] },
          { title: 'Behavioral Biometrics (Human vs Bot)', tierValues: [true, true, true] },
          { title: 'Account Takeover (ATO) Prevention', tierValues: ['Basic Scoring', 'Real-Time Intervention', 'Real-Time + Mule Graph'] },
          { title: 'Session Replay for Fraud Analysts', tierValues: [false, true, true] },
          { title: 'Law Enforcement Referral Packages', tierValues: [false, false, true] },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Difaac Fraud Protection slow down user checkout or app performance?',
        answer: 'No. Our SDK runs asynchronously and performs client-side evaluations in under 15ms without requiring invasive CAPTCHAs.',
      },
    ],
  },
  'digital-risk-protection': {
    slug: 'digital-risk-protection',
    name: 'Digital Risk Protection',
    icon: 'Fingerprint',
    tagline: 'Protect your brand, executives, and domains across open, deep, and dark web channels.',
    description: 'Automated discovery of lookalike phishing domains, fake social accounts, leaked credentials, and fast legal takedowns.',
    tiers: [
      {
        id: 'essentials',
        name: 'Domain & Brand Guard',
        tagline: 'Typosquatting & Phishing Detection',
        idealFor: 'Growing brands needing proactive domain registration alerts and phishing detection.',
        features: [
          'Continuous monitoring of newly registered domains (typosquats)',
          'Phishing kit detection and brand impersonation alerts',
          'Automated cease-and-desist notifications',
          'Weekly digital exposure report',
        ],
        highlights: ['Typosquat Discovery', 'Phishing Alerts', 'Automated C&D'],
      },
      {
        id: 'advanced',
        name: 'Full Digital Protection',
        tagline: 'Managed Takedowns & Social Monitoring',
        idealFor: 'Enterprises requiring end-to-end takedown operations across registries, hosts, and social platforms.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Full-service managed takedowns (95%+ success rate within 24h)',
          'Social media impersonation & rogue mobile app detection',
          'Dark web credential leak and leaked source code discovery',
          'Executive VIP digital footprint monitoring',
        ],
        highlights: ['Managed Takedowns', 'Dark Web Leaks', 'VIP Protection', 'Mobile App Scans'],
      },
      {
        id: 'enterprise',
        name: 'Global Brand Defense',
        tagline: 'Unlimited Takedowns & Strategic Attribution',
        idealFor: 'Global enterprises, multinational retail, and high-visibility financial institutions.',
        features: [
          'Unlimited international takedown requests',
          'Dedicated Brand Defense Analyst & direct legal registrar liaisons',
          'Counterfeit marketplace and unauthorized distributor scanning',
          'Adversary attribution behind targeted brand campaigns',
        ],
        highlights: ['Unlimited Takedowns', 'Dedicated Analyst', 'Marketplace Counterfeit', 'Actor Attribution'],
      },
    ],
    matrix: [
      {
        name: 'Discovery & Takedown Scope',
        rows: [
          { title: 'Domain Typosquatting & Lookalike Scanning', tierValues: [true, true, true] },
          { title: 'End-to-End Takedown Execution', tierValues: ['Self-Service Tools', 'Included (20 / month)', 'Unlimited Managed Takedowns'] },
          { title: 'Dark Web Leaked Credential Monitoring', tierValues: ['Domain Level', 'Full Corporate Exposure', 'Full Corporate + Executive VIP'] },
          { title: 'Fake Mobile App & Marketplace Counterfeiting', tierValues: [false, true, true] },
        ],
      },
    ],
    faqs: [
      {
        question: 'How fast are phishing domains taken down?',
        answer: 'Through our direct partnerships with global domain registrars and hosting providers, over 90% of verified phishing domains are taken down within 24 hours.',
      },
    ],
  },
  'attack-surface-management': {
    slug: 'attack-surface-management',
    name: 'Attack Surface Management',
    icon: 'Globe',
    tagline: 'Continuous external asset discovery, exposure management, and risk prioritization.',
    description: 'Map your complete digital footprint across IPs, domains, cloud buckets, and open ports with zero agent installation.',
    tiers: [
      {
        id: 'essentials',
        name: 'Asset Visibility',
        tagline: 'External Asset Mapping',
        idealFor: 'Organizations looking to discover shadow IT and catalog internet-facing assets.',
        features: [
          'Automated discovery of domains, subdomains, and IP ranges',
          'Open port and exposed service inventory',
          'Certificate expiration and misconfiguration alerts',
          'Monthly external attack surface posture score',
        ],
        highlights: ['Asset Discovery', 'Port Scanning', 'Certificate Alerts'],
      },
      {
        id: 'advanced',
        name: 'Continuous Risk Scanner',
        tagline: 'Exploitability Scoring & Guided Remediation',
        idealFor: 'Security teams needing continuous vulnerability validation and prioritized fix guidance.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Daily continuous scans with zero-agent external scanning',
          'Exploitability risk ranking based on active adversary weapons',
          'Shadow IT and unmanaged cloud asset identification',
          'Actionable remediation playbooks and ticketing integrations',
        ],
        highlights: ['Continuous Daily Scans', 'Exploitability Scoring', 'Shadow IT Detection'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Perimeter Control',
        tagline: 'Full Supply Chain & Subsidiary Mapping',
        idealFor: 'Conglomerates and enterprise groups managing multiple subsidiaries and third-party vendors.',
        features: [
          'Subsidiary and M&A digital asset discovery and mapping',
          'Third-party supply chain risk scoring and monitoring',
          'Custom API integration with SIEM/Vulnerability Management tools',
          'Dedicated attack surface strategist and quarterly assessments',
        ],
        highlights: ['Supply Chain Scanning', 'Subsidiary Mapping', 'Custom Integrations'],
      },
    ],
    matrix: [
      {
        name: 'Scanning & Discovery Scope',
        rows: [
          { title: 'Domain & Subdomain Enumeration', tierValues: [true, true, true] },
          { title: 'Continuous Exposure & Port Scanning', tierValues: ['Weekly', 'Continuous Daily', 'Continuous Real-Time'] },
          { title: 'Exploitability Risk Prioritization', tierValues: ['CVSS Based', 'Threat Intel Correlated', 'Adversary Weaponized Priority'] },
          { title: 'Subsidiary & Third-Party Vendor Scans', tierValues: [false, false, true] },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do we need to install software or agents for ASM?',
        answer: 'No. Difaac Attack Surface Management is completely agentless and operates externally from an adversary perspective.',
      },
    ],
  },
  'business-email-protection': {
    slug: 'business-email-protection',
    name: 'Business Email Protection',
    icon: 'Mail',
    tagline: 'Detonate advanced email threats, payload-free attacks, and BEC before inbox delivery.',
    description: 'API-based email security that combines behavior analysis, detonation sandboxing, and retroactive threat hunting.',
    tiers: [
      {
        id: 'essentials',
        name: 'Inbound Gateway Defense',
        tagline: 'Phishing & Malware Detonation',
        idealFor: 'Organizations needing robust detection of malicious attachments and links.',
        features: [
          'Cloud-native sandbox detonation of links & attachments',
          'Phishing and credential harvesting detection',
          'Spam and spoofing protection (SPF, DKIM, DMARC validation)',
          'Direct API deployment for Microsoft 365 & Google Workspace',
        ],
        highlights: ['Sandbox Detonation', 'Phishing Blocker', 'API Deployment'],
      },
      {
        id: 'advanced',
        name: 'Advanced BEC & Social Shield',
        tagline: 'Payload-Free & Executive Impersonation Defense',
        idealFor: 'Enterprises defending against sophisticated Business Email Compromise and wire-fraud scams.',
        popular: true,
        badge: 'Recommended',
        features: [
          'AI-driven Natural Language Processing to detect payload-free BEC',
          'VIP & executive impersonation protection',
          'Retroactive threat hunting across historical mailboxes',
          'Automated one-click malicious email clawback/quarantine',
        ],
        highlights: ['AI BEC Protection', 'Retroactive Hunting', 'Automated Clawback'],
      },
      {
        id: 'enterprise',
        name: 'Total Email Mission Assurance',
        tagline: 'Comprehensive Threat Analysis & Forensic Response',
        idealFor: 'Financial, legal, and government entities with critical communication security needs.',
        features: [
          'Full-scale forensic analysis of targeted spear-phishing campaigns',
          'Custom mail policy and threat extraction rule authoring',
          'Integration with Difaac 24/7 SOC for analyst-reviewed escalations',
          'Dedicated email security engineer support',
        ],
        highlights: ['Targeted Campaign Forensics', '24/7 SOC Integration', 'Custom Policy Authoring'],
      },
    ],
    matrix: [
      {
        name: 'Email Defense Capabilities',
        rows: [
          { title: 'Link & Attachment Sandbox Detonation', tierValues: [true, true, true] },
          { title: 'Payload-Free Business Email Compromise (BEC) AI', tierValues: [false, true, true] },
          { title: 'Retroactive Inbox Threat Hunting & Clawback', tierValues: [false, true, true] },
          { title: '24/7 SOC Analyst Triage & Threat Attribution', tierValues: [false, false, true] },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Difaac Business Email Protection require changing MX records?',
        answer: 'No. Our solution integrates directly via high-speed API with Microsoft 365 and Google Workspace in minutes, with zero downtime or MX record changes.',
      },
    ],
  },
}
