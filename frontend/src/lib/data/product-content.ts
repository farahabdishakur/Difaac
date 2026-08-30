/**
 * Editorial content for product detail pages.
 *
 * This lives apart from `products.ts` on purpose: `Product` mirrors the shape
 * the FastAPI backend returns, while everything here is frontend-only page
 * copy keyed by product slug. Keeping them separate means product data can
 * come from the live API without the detail page losing its sections.
 */

export type ProductContent = {
  metrics: { value: string; label: string }[]
  useCases: { title: string; description: string }[]
  howItWorks: { title: string; description: string }[]
  delivery: { title: string; description: string }[]
}

export const productContent: Record<string, ProductContent> = {
  'threat-intelligence': {
    metrics: [
      { value: '700+', label: 'Threat actor groups tracked' },
      { value: 'MITRE ATT&CK', label: 'Techniques mapped' },
      { value: 'STIX/TAXII', label: 'Native feed delivery' },
    ],
    useCases: [
      {
        title: 'Prioritise the threats that target you',
        description:
          'Filter global adversary activity down to the actors that operate against your sector and region, so analysts spend their time on relevant intelligence.',
      },
      {
        title: 'Enrich alerts already in your SIEM',
        description:
          'Indicators arrive pre-scored and attributed, giving triage teams the context to close false positives quickly and escalate real intrusions.',
      },
      {
        title: 'Brief the board with evidence',
        description:
          'Actor profiles and campaign reporting translate technical activity into the business risk language leadership needs.',
      },
    ],
    howItWorks: [
      {
        title: 'Collect',
        description:
          'Automated crawlers gather from closed forums, marketplaces, and messaging channels alongside malware and infrastructure telemetry.',
      },
      {
        title: 'Attribute',
        description:
          'Behavioural and infrastructure overlap links observed activity to known actors and campaigns.',
      },
      {
        title: 'Deliver',
        description:
          'Scored indicators and reporting reach your SIEM, SOAR, or analysts through the channels they already use.',
      },
    ],
    delivery: [
      { title: 'STIX/TAXII', description: 'Standards-based feed delivery into existing intelligence platforms.' },
      { title: 'REST API', description: 'Programmatic access for custom enrichment and automation.' },
      { title: 'SIEM & SOAR', description: 'Indicators routed directly into detection and response tooling.' },
    ],
  },

  'fraud-protection': {
    metrics: [
      { value: 'Real time', label: 'Session and transaction scoring' },
      { value: 'Web + mobile', label: 'Device fingerprinting coverage' },
      { value: 'Network-wide', label: 'Shared fraud intelligence' },
    ],
    useCases: [
      {
        title: 'Stop account takeover at login',
        description:
          'Score every authentication attempt against device, behavioural, and network signals before a session is granted.',
      },
      {
        title: 'Protect payments without friction',
        description:
          'Challenge only the transactions that carry genuine risk, leaving legitimate customers with an uninterrupted checkout.',
      },
      {
        title: 'Detect bots and scripted abuse',
        description:
          'Behavioural biometrics separate human interaction from automation, catching credential stuffing and inventory scraping.',
      },
    ],
    howItWorks: [
      {
        title: 'Fingerprint',
        description:
          'A tamper-resistant device identity is established across web and mobile sessions.',
      },
      {
        title: 'Observe',
        description:
          'Behavioural signals are collected continuously through the session rather than at a single checkpoint.',
      },
      {
        title: 'Score and act',
        description:
          'Each session and transaction is scored in milliseconds, and your policies decide whether to allow, challenge, or block.',
      },
    ],
    delivery: [
      { title: 'Client SDK', description: 'Lightweight web and mobile SDKs for signal collection.' },
      { title: 'Decision API', description: 'Real-time risk scores returned inline with your auth and payment flows.' },
      { title: 'Analyst workspace', description: 'Case management with full session replay for fraud investigations.' },
    ],
  },

  'managed-xdr': {
    metrics: [
      { value: '24/7', label: 'Analyst-staffed SOC' },
      { value: 'Under 15 min', label: 'Response time for critical incidents' },
      { value: 'Four layers', label: 'Endpoint, network, email, and cloud' },
    ],
    useCases: [
      {
        title: 'Extend a small security team',
        description:
          'Round-the-clock analyst coverage without hiring for night shifts, weekends, and holiday rotations.',
      },
      {
        title: 'Cut alert fatigue',
        description:
          'Human-led triage on high-confidence detections means your team receives escalations, not raw alert queues.',
      },
      {
        title: 'Contain intrusions in progress',
        description:
          'Pre-approved playbooks let analysts isolate hosts and cut attacker access while your team is still being briefed.',
      },
    ],
    howItWorks: [
      {
        title: 'Connect',
        description:
          'Telemetry from endpoint, network, email, and cloud sources is unified into a single detection pipeline.',
      },
      {
        title: 'Triage',
        description:
          'Correlated signals become one timeline, and analysts validate every high-confidence detection by hand.',
      },
      {
        title: 'Respond',
        description:
          'Containment actions run against agreed playbooks, with approval workflows where you require them.',
      },
    ],
    delivery: [
      { title: 'Telemetry connectors', description: 'Ingest from existing endpoint, network, and cloud tooling.' },
      { title: 'Escalation channels', description: 'Notifications routed to the ticketing and chat systems you already run.' },
      { title: 'Response playbooks', description: 'Containment scoped and pre-approved with your team before an incident.' },
    ],
  },

  'attack-surface-management': {
    metrics: [
      { value: 'Agentless', label: 'No deployment on discovered assets' },
      { value: 'Continuous', label: 'Discovery and exposure scanning' },
      { value: 'Exploitability', label: 'Basis for risk ranking' },
    ],
    useCases: [
      {
        title: 'Find the assets nobody documented',
        description:
          'Surface shadow IT, forgotten subdomains, and legacy infrastructure that never made it into the asset inventory.',
      },
      {
        title: 'Fix what is genuinely reachable',
        description:
          'Ranking by real-world exploitability keeps remediation effort on the exposures an attacker could actually use.',
      },
      {
        title: 'Watch acquisitions and new estates',
        description:
          'Bring newly acquired infrastructure under monitoring before it is migrated into your standard controls.',
      },
    ],
    howItWorks: [
      {
        title: 'Discover',
        description:
          'Domains, IP ranges, and cloud assets tied to your organisation are mapped automatically from external signals.',
      },
      {
        title: 'Scan',
        description:
          'Each asset is checked for misconfigurations, open ports, and vulnerable services without installing agents.',
      },
      {
        title: 'Prioritise',
        description:
          'Findings are ranked by exploitability and business impact, then tracked until they are closed.',
      },
    ],
    delivery: [
      { title: 'External discovery', description: 'No agents or network access required on discovered assets.' },
      { title: 'Ticketing integration', description: 'Findings pushed into the workflow your remediation team uses.' },
      { title: 'Change alerts', description: 'Notification when new or altered assets appear on your perimeter.' },
    ],
  },

  'digital-risk-protection': {
    metrics: [
      { value: 'Minutes', label: 'From registration to phishing detection' },
      { value: 'In-house', label: 'Takedown operations team' },
      { value: 'Open, deep, dark', label: 'Web monitoring coverage' },
    ],
    useCases: [
      {
        title: 'Shut down phishing infrastructure',
        description:
          'Lookalike domains are flagged as they are registered and moved into takedown before a campaign reaches customers.',
      },
      {
        title: 'Defend the brand on marketplaces',
        description:
          'Counterfeit listings and unauthorised use of your brand are detected across marketplaces and social platforms.',
      },
      {
        title: 'Protect named executives',
        description:
          'Monitoring for impersonation, leaked personal data, and targeted harassment of key personnel.',
      },
    ],
    howItWorks: [
      {
        title: 'Monitor',
        description:
          'Domain registrations, marketplaces, social platforms, and dark web sources are watched continuously for your brand.',
      },
      {
        title: 'Validate',
        description:
          'Detections are reviewed so takedown effort goes to genuine impersonation rather than false matches.',
      },
      {
        title: 'Take down',
        description:
          'An in-house team pursues removal through direct registrar, host, and platform relationships.',
      },
    ],
    delivery: [
      { title: 'Brand onboarding', description: 'Domains, trademarks, and executives scoped during setup.' },
      { title: 'Takedown workflow', description: 'Case tracking from detection through to confirmed removal.' },
      { title: 'Alerting', description: 'Notifications routed to your brand, legal, and security stakeholders.' },
    ],
  },

  'business-email-protection': {
    metrics: [
      { value: 'Sandboxed', label: 'Attachment and link detonation' },
      { value: 'Payload-free', label: 'Business email compromise detection' },
      { value: 'API-based', label: 'Deployment without mail rerouting' },
    ],
    useCases: [
      {
        title: 'Catch what the gateway missed',
        description:
          'Detonation in an isolated environment exposes malicious behaviour that static scanning and reputation checks do not see.',
      },
      {
        title: 'Stop invoice and payroll fraud',
        description:
          'Impersonation and social engineering are detected from message context, not from an attachment or link.',
      },
      {
        title: 'Re-examine mail already delivered',
        description:
          'Retroactive hunting re-scans historical mail flow as new intelligence emerges, surfacing threats that landed earlier.',
      },
    ],
    howItWorks: [
      {
        title: 'Connect',
        description:
          'API-based integration with your existing mail platform, leaving current routing and MX records untouched.',
      },
      {
        title: 'Detonate',
        description:
          'Suspicious attachments and embedded links are executed in isolation before they reach a mailbox.',
      },
      {
        title: 'Hunt',
        description:
          'Delivered mail is continuously re-scanned so newly identified threats can be pulled back from inboxes.',
      },
    ],
    delivery: [
      { title: 'Mail platform API', description: 'Integrates without changing existing mail routing.' },
      { title: 'Detonation environment', description: 'Isolated execution of attachments and links.' },
      { title: 'Retroactive search', description: 'Historical mail re-scanned as intelligence is updated.' },
    ],
  },
}

export function getProductContent(slug: string | undefined): ProductContent | undefined {
  return slug ? productContent[slug] : undefined
}
