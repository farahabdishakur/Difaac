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
  tooltip: string
  tierValues: (boolean | string)[]
}

export type MatrixCategory = {
  id: string
  name: string
  rows: MatrixRow[]
}

export type ArchitecturalSubTab = {
  id: string
  label: string
  headline: string
  description: string
  accentBadge?: string
}

export type ProductSubscription = {
  slug: string
  name: string
  icon: string
  tagline: string
  description: string
  subTabs?: ArchitecturalSubTab[]
  tiers: SubscriptionTier[]
  matrix: MatrixCategory[]
  faqs: { question: string; answer: string }[]
}

export const productSubscriptions: Record<string, ProductSubscription> = {
  'managed-xdr': {
    slug: 'managed-xdr',
    name: 'Managed XDR',
    icon: 'Activity',
    tagline: 'Detect, investigate, and neutralize cyberthreats with sub-15 minute response SLAs across endpoints, identity, network, and cloud workloads.',
    description: 'A unified defense architecture combining multi-telemetry collection, behavioral analytics, automated containment playbooks, and 24/7/365 elite SOC operations.',
    subTabs: [
      {
        id: 'xdr',
        label: 'Extended Detection and Response',
        headline: 'Unified Telemetry & Cross-Domain Threat Correlation',
        description: 'Extended Detection and Response (XDR) correlates telemetry across endpoint sensors, network taps, cloud workloads, and email gateways into unified incident graphs, eliminating alert fatigue and reducing adversary dwell time.',
        accentBadge: 'Unified Platform'
      },
      {
        id: 'mxdr',
        label: 'Managed Extended Detection and Response',
        headline: '24/7/365 Human SOC Operations & Active Containment',
        description: 'Managed XDR couples Difaac’s high-fidelity telemetry with senior cyber defense analysts who continuously hunt for unaddressed TTPs, execute pre-approved containment rules, and lead incident remediation with guaranteed SLAs.',
        accentBadge: 'Fully Managed SOC'
      },
      {
        id: 'edr',
        label: 'Endpoint Detection and Response',
        headline: 'Kernel-Level Host Visibility, Behavioral Heuristics & Forensics',
        description: 'Endpoint Detection and Response (EDR) provides granular process-level visibility, memory dumping capabilities, network isolation, and deep digital forensic artifact collection across Windows, Linux, and macOS assets.',
        accentBadge: 'Host Protection'
      }
    ],
    tiers: [
      {
        id: 'standard',
        name: 'Standard',
        tagline: 'Foundational Telemetry & Hybrid SOC Ingestion',
        idealFor: 'Mid-sized enterprises with internal Tier-1 responders who need unified event telemetry, automated correlation, and business-hours escalation.',
        features: [
          'Unified endpoint & cloud telemetry collection',
          'Automated MITRE ATT&CK correlation engine',
          'Business-hours (8x5) alert triage & analyst escalation',
          'Standard IOC and threat intelligence enrichment',
          'Host isolation & remote quarantine capabilities',
          'Weekly security posture and health reporting',
        ],
        highlights: ['8x5 Analyst Support', 'Automated Correlation', '7-Day Forensic Retention', 'Host Isolation'],
      },
      {
        id: 'pro',
        name: 'Pro',
        tagline: '24/7 Managed SOC & Rapid Threat Containment',
        idealFor: 'Enterprises requiring round-the-clock defense, sub-15 minute response SLAs, hunting that does not wait for an alert, and containment we are pre-authorised to carry out.',
        popular: true,
        badge: 'Recommended',
        features: [
          '24/7/365 Continuous Human SOC monitoring & triage',
          '< 15 min Mean Time to Respond (MTTR) for critical incidents',
          'Adversary hunting campaigns, every two weeks',
          'Pre-authorized containment execution (host isolation, account lock)',
          'Interactive malware detonation sandbox with behavioral telemetry',
          '14-day endpoint forensic & 30-day network log retention',
          'Assigned Technical Account Manager & quarterly risk reviews',
        ],
        highlights: ['24/7/365 Continuous SOC', '<15 Min Response SLA', 'Active Threat Hunting', 'Full Detonation Sandbox'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'Mission Assurance, Dedicated CSIRT & DFIR Integration',
        idealFor: 'Financial institutions, telecoms, critical infrastructure, and government entities needing dedicated forensic investigators and custom detection engineering.',
        features: [
          'Everything in Pro plus:',
          'Dedicated CSIRT Incident Commander & Senior Forensic Lead',
          'Guaranteed <10 min response SLA for high-severity intrusions',
          'Included Emergency Incident Response Retainer engagement hours (40 hrs)',
          'Custom adversary detection rule engineering (Sigma / YARA / Suricata)',
          '30-day endpoint forensic & 60-day network PCAP retention',
          'On-premise / private cloud sensor appliances & multi-tenant isolation',
          'Briefings for executives and the board, in plain language',
        ],
        highlights: ['Dedicated CSIRT Lead', '<10 Min Critical SLA', '40h IR Retainer Credits', '30-Day Deep Forensics'],
      },
    ],
    matrix: [
      {
        id: 'xdr-core',
        name: 'XDR - Extended Detection and Response',
        rows: [
          {
            title: 'XDR Cross-Telemetry Correlation',
            tooltip: 'Automated correlation engine synthesizing endpoint telemetry, network connections, cloud audit logs, and email metadata into a singular contextual incident timeline.',
            tierValues: [true, true, true],
          },
          {
            title: 'Consolidated Security Data Lake',
            tooltip: 'High-throughput, centralized repository storing raw telemetry, alert records, detonation verdicts, and threat actor attribution accessible in real time.',
            tierValues: [true, true, true],
          },
          {
            title: 'Unified Incident Response Console',
            tooltip: 'A centralized single-pane interface providing analyst workflows, artifact inspection, and coordinated containment actions without pivot friction.',
            tierValues: [true, true, true],
          },
          {
            title: 'Integrated Threat Intelligence Graph',
            tooltip: 'Native integration with Difaac Threat Intelligence, mapping observed indicators directly to adversary infrastructure, campaign profiles, and MITRE ATT&CK techniques.',
            tierValues: ['Standard Mapping', 'Full Graph Pivoting', 'Full Graph + Actor Tracking'],
          },
          {
            title: 'Automated Threat Actor Attribution',
            tooltip: 'Heuristic and signature-driven attribution connecting incident footprints to known nation-state and organized cybercrime syndicates active in the region.',
            tierValues: [false, true, true],
          },
          {
            title: 'Interactive Detonation Sandbox',
            tooltip: 'Isolated detonation environment executing suspicious executables, documents, and scripts with kernel-level syscall tracing and anti-evasion hooks.',
            tierValues: [false, '50 files / day', 'Unlimited Detonations'],
          },
          {
            title: 'Open REST APIs & SIEM Forwarding',
            tooltip: 'Bi-directional APIs, Webhooks, and standard syslog/CEF forwarders to stream normalized alerts into Splunk, Microsoft Sentinel, Elastic, or existing SOAR tools.',
            tierValues: ['Read-Only API', 'Full Bi-directional API', 'Full API + Custom Adapters'],
          },
          {
            title: 'Technical Support & Escalation SLA',
            tooltip: 'Availability of specialized security engineers for technical troubleshooting, sensor health, and architecture optimization.',
            tierValues: ['8x5 Email & Portal', '24/7/365 Phone, Chat & Email', '24/7 Dedicated TAM & Phone'],
          },
        ],
      },
      {
        id: 'edr-core',
        name: 'EDR - Endpoint Protection and Response',
        rows: [
          {
            title: 'Endpoint Forensics Data Retention',
            tooltip: 'Duration of retrospective endpoint event storage (process trees, file writes, registry changes, network sockets) available for historical threat hunting.',
            tierValues: ['7 Days', '14 Days', '30 Days'],
          },
          {
            title: 'Live Forensic Evidence & Memory Collection',
            tooltip: 'Remote acquisition of volatile memory dumps, MFT records, prefetch files, and shimcache artifacts preserving strict forensic chain of custody.',
            tierValues: [false, true, true],
          },
          {
            title: 'One-Click Host Containment',
            tooltip: 'One-click or automated network isolation, process termination, file quarantine, and DNS sinkholing executed directly on the host agent.',
            tierValues: [true, true, true],
          },
          {
            title: 'Automated IoC Extraction & Validation',
            tooltip: 'Continuous extraction of newly observed hashes, domains, and command lines with automated comparison against threat intelligence repositories.',
            tierValues: [true, true, true],
          },
          {
            title: 'Continuous Asset Inventory & Scoping',
            tooltip: 'Automated discovery and continuous tracking of hardware, operating systems, installed packages, and exposed local services across managed endpoints.',
            tierValues: [true, true, true],
          },
          {
            title: 'Application Allowlisting & Exploit Prevention',
            tooltip: 'Granular execution policies preventing unauthorized binaries, DLL side-loading, and memory injection across critical workstations and servers.',
            tierValues: ['Standard Policy', 'Advanced Behavioral', 'Custom Fine-Tuned Rules'],
          },
          {
            title: 'Cross-Platform Operating System Support',
            tooltip: 'Native, lightweight sensor agents engineered for minimal CPU consumption (<1%) across Windows, Windows Server, Linux (RHEL, Ubuntu, Debian), and macOS.',
            tierValues: [true, true, true],
          },
        ],
      },
      {
        id: 'bep-core',
        name: 'BEP - Business Email Protection',
        rows: [
          {
            title: 'Cloud NGAV & Attachment Inspection',
            tooltip: 'In-flight scanning of incoming messages using multi-engine antivirus heuristics and static file analysis before inbox delivery.',
            tierValues: [true, true, true],
          },
          {
            title: 'Behavioral BEC & Executive Impersonation Filter',
            tooltip: 'Natural language analysis and display-name spoofing algorithms detecting payload-free business email compromise, wire-fraud requests, and vendor fraud.',
            tierValues: ['Basic Rules', 'Advanced AI NLP', 'Advanced AI + Custom VIP Tracking'],
          },
          {
            title: 'Message History & Audit Log Retention',
            tooltip: 'Retention timeframe for retrospective searching and audit compliance across all incoming, outgoing, and internal email correspondence.',
            tierValues: ['14 Days', '30 Days', '60 Days'],
          },
          {
            title: 'Real-Time Link & URL Sandbox Detonation',
            tooltip: 'Time-of-click and pre-delivery automated browser crawling of hyperlinks to detect credential harvesting pages, evasive redirects, and zero-day lures.',
            tierValues: [false, true, true],
          },
          {
            title: 'Zero-Second Retroactive Mailbox Clawback',
            tooltip: 'Automated post-delivery removal of newly identified malicious emails across all tenant mailboxes in Microsoft 365 or Google Workspace with single-click audit.',
            tierValues: [false, true, true],
          },
          {
            title: 'On-Premise / Hybrid Mail Server Support',
            tooltip: 'Support for hybrid Exchange deployments, local SMTP relays, and air-gapped mail infrastructure.',
            tierValues: [false, 'Optional Add-on', true],
          },
        ],
      },
      {
        id: 'nta-core',
        name: 'NTA - Network Traffic Analysis',
        rows: [
          {
            title: 'Network Traffic Logs & Flow Retention',
            tooltip: 'Searchable historical storage of protocol metadata, NetFlow/IPFIX records, and extracted session artifacts for incident investigation.',
            tierValues: ['14 Days', '30 Days', '60 Days'],
          },
          {
            title: 'Virtual & Physical Sensor Appliance Allotment',
            tooltip: 'Allotment of network inspection sensor instances deployed on SPAN/TAP ports or virtual switches across data centers and branch offices.',
            tierValues: ['1 Appliance', '10 Appliances', '30+ Custom Appliances'],
          },
          {
            title: 'Lateral Movement & C2 Tunneling Detection',
            tooltip: 'Machine learning heuristics identifying suspicious SMB/RPC connections, Pass-the-Hash, Kerberoasting, and DNS/ICMP tunneling attempts.',
            tierValues: [true, true, true],
          },
          {
            title: 'Encrypted Traffic Analysis (ETA)',
            tooltip: 'Inspection of TLS/SSL handshakes, cipher suites, and packet timing to detect malware beacons without requiring invasive SSL decryption.',
            tierValues: [false, true, true],
          },
          {
            title: 'Full Packet Capture (PCAP) on Trigger',
            tooltip: 'Automated rolling buffer capturing raw PCAP files before, during, and after high-fidelity security alerts for detailed protocol analysis.',
            tierValues: [false, '5 min rolling buffer', '30 min rolling buffer'],
          },
        ],
      },
      {
        id: 'soc-operations',
        name: 'Managed SOC Operations & Incident Response',
        rows: [
          {
            title: 'SOC Operational Coverage',
            tooltip: 'Continuous monitoring by certified SOC tier analysts evaluating incoming telemetry, discarding benign anomalies, and escalating validated threats.',
            tierValues: ['8x5 Regional Business', '24/7/365 Continuous', '24/7/365 Dedicated CSIRT'],
          },
          {
            title: 'Critical Incident MTTR SLA',
            tooltip: 'Guaranteed Mean Time to Respond from initial alert generation to analyst verification and customer notification for severity-1 incidents.',
            tierValues: ['< 60 Minutes', '< 15 Minutes', '< 10 Minutes Guaranteed'],
          },
          {
            title: 'Human Threat Verification (Zero False-Alarm Guarantee)',
            tooltip: 'Every escalated incident is reviewed and validated by human Tier-2/3 investigators with actionable remediation instructions, eliminating notification noise.',
            tierValues: [true, true, true],
          },
          {
            title: 'Pre-Authorized Containment Execution',
            tooltip: 'Analyst-executed emergency response based on customized client Rules of Engagement (e.g. host isolation, credential reset, network port shutdown).',
            tierValues: ['Guided Recommendations', 'Active Containment (Pre-approved)', 'Immediate Full Authority'],
          },
          {
            title: 'Threat Hunting Campaigns',
            tooltip: 'Hypothesis-driven threat hunts mapped to MITRE ATT&CK conducted by senior threat researchers to discover stealthy persistence mechanisms.',
            tierValues: ['Quarterly Sweeps', 'Bi-Weekly Campaigns', 'Continuous Bespoke Hunting'],
          },
          {
            title: 'Included Incident Response Retainer Hours',
            tooltip: 'Pre-packaged emergency digital forensics and incident response retainer engagement hours included directly within your subscription.',
            tierValues: ['Standby Access', '20 Hours Included', '40 Hours Included'],
          },
          {
            title: 'Dedicated CSIRT Lead & Forensic Investigator',
            tooltip: 'Direct assignment of a named senior cyber incident commander who understands your technical topology and leads emergency response.',
            tierValues: [false, false, true],
          },
          {
            title: 'Executive & Compliance Reporting',
            tooltip: 'Audit-ready reports mapping security posture and containment metrics against ISO 27001, SOC 2, PCI-DSS, and regional regulatory frameworks.',
            tierValues: ['Standard Monthly', 'Quarterly Executive Review', 'Monthly Board-Level Briefings'],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'How quickly can Difaac Managed XDR be deployed across our enterprise?',
        answer: 'Endpoint sensors and cloud telemetry connectors can be deployed in under 24 hours. For cloud platforms (AWS, Azure, Microsoft 365, Google Workspace), integration is completely API-driven and takes less than 30 minutes with zero downtime. Network sensors are provided as pre-configured virtual appliances that connect directly to your core switch SPAN/mirror ports.',
      },
      {
        question: 'Can Difaac co-exist with our existing EDR or SIEM (e.g., Microsoft Defender, CrowdStrike)?',
        answer: 'Yes. Difaac Managed XDR is telemetry-agnostic. If you already have existing endpoint security, our platform can ingest and correlate feeds from your current SIEM, Microsoft Defender, CrowdStrike, or SentinelOne, while our 24/7 SOC team provides around-the-clock analyst triage, threat hunting, and containment.',
      },
      {
        question: 'What happens when a critical breach or ransomware outbreak is detected at 3:00 AM?',
        answer: 'Our 24/7 SOC analysts triage and verify the threat within 15 minutes. Under pre-agreed Rules of Engagement (ROE), analysts can immediately isolate compromised hosts, terminate malicious processes, revoke compromised tokens, and establish direct phone bridge communication with your emergency contact.',
      },
      {
        question: 'How do we control what containment actions Difaac analysts are allowed to take?',
        answer: 'During onboarding, we write a Rules of Engagement (ROE) charter. You specify which assets (e.g., primary domain controllers, core banking servers, hospital ICU systems) require explicit human authorization before containment, and which developer or general workstations can be isolated automatically.',
      },
      {
        question: 'Where is our telemetry stored and does it comply with data sovereignty laws?',
        answer: 'Difaac supports dedicated regional data residency. Telemetry can be hosted within compliant regional cloud regions or fully on-premise within your data center using our Enterprise tier private appliance cluster.',
      },
    ],
  },

  'incident-response-retainer': {
    slug: 'incident-response-retainer',
    name: 'Incident Response Retainer',
    icon: 'ShieldAlert',
    tagline: 'Guaranteed emergency response SLAs, forensic investigators on standby, and readiness exercises run before anything happens.',
    description: 'A pre-negotiated master service agreement ensuring immediate availability of Tier-3 DFIR specialists during critical cybersecurity emergencies.',
    tiers: [
      {
        id: 'standard',
        name: 'Standby Retainer',
        tagline: 'Guaranteed SLA & Emergency Hotline',
        idealFor: 'Organizations requiring pre-negotiated legal and contractual terms with guaranteed emergency availability.',
        features: [
          'Pre-negotiated Master Services Agreement (MSA) with zero emergency surcharge',
          'Guaranteed 4-hour remote response SLA for critical incidents',
          'Annual compromise readiness self-assessment questionnaire',
          'Dedicated emergency hotline access 24/7/365',
        ],
        highlights: ['Pre-Negotiated Rates', '4h Response SLA', '24/7 Hotline'],
      },
      {
        id: 'pro',
        name: 'Active Retainer',
        tagline: 'Pre-Funded Hours & Priority Deployment',
        idealFor: 'Enterprises wanting pre-purchased forensic hours usable for incident investigation, tabletop exercises, or health audits.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Guaranteed 2-hour remote / 12-hour on-site response SLA',
          '40 pre-funded incident response & digital forensics hours',
          'Annual tabletop exercise (executive simulation)',
          'Readiness assessment of logging and forensic visibility',
          'Unused hours roll over, or become security audits',
        ],
        highlights: ['2h Remote SLA', '40 Pre-funded Hours', 'Tabletop Exercise', 'Hour Rollover'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Dedicated',
        tagline: 'Designated CSIRT & Bespoke Preparedness',
        idealFor: 'Critical infrastructure, major banks, and conglomerates requiring named investigators and on-site readiness.',
        features: [
          'Guaranteed 1-hour remote / 6-hour on-site response SLA',
          '100 pre-funded retainer hours for forensic investigations',
          'Named Lead Incident Commander and Digital Forensic Specialist',
          'Bi-annual red teaming and crisis communication drill',
          'Direct coordination with legal counsel and regulatory authorities',
        ],
        highlights: ['1h Critical SLA', '100 Hours Allotment', 'Named CSIRT Lead', 'Regulatory Support'],
      },
    ],
    matrix: [
      {
        id: 'ir-sla',
        name: 'Response SLAs & Logistics',
        rows: [
          {
            title: 'Remote Emergency Response SLA',
            tooltip: 'Guaranteed timeframe for remote incident response team mobilization following formal notification.',
            tierValues: ['< 4 Hours', '< 2 Hours', '< 1 Hour'],
          },
          {
            title: 'On-Site Forensic Deployment SLA',
            tooltip: 'Timeframe for physical deployment of forensic investigators to customer primary headquarters.',
            tierValues: ['Next Business Day', '< 12 Hours', '< 6 Hours'],
          },
          {
            title: 'Included Retainer Hours (Annual)',
            tooltip: 'Hours set aside in advance, for a live incident or for the work that prevents one.',
            tierValues: ['0 Hours (Pay-as-you-go)', '40 Hours', '100 Hours'],
          },
          {
            title: 'Turning Unused Hours Into Tabletops and Audits',
            tooltip: 'Ability to apply unused retainer hours toward tabletop exercises, vulnerability assessments, or threat hunting.',
            tierValues: [false, true, true],
          },
          {
            title: 'Named Lead Forensic Investigator',
            tooltip: 'Direct pre-assignment of a dedicated senior forensic investigator who maintains familiarization with your environment.',
            tierValues: [false, false, true],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if we do not experience an incident during the subscription period?',
        answer: 'Unused hours in our Active and Enterprise tiers can be converted into work such as executive tabletop exercises, compromise assessments, or purple team exercises.',
      },
      {
        question: 'Can Difaac assist with regulatory disclosure and law enforcement coordination?',
        answer: 'Yes. Our forensic reports follow strict evidentiary chain of custody standards suitable for legal proceedings, insurance claims, and statutory disclosures.',
      },
    ],
  },

  'business-email-protection': {
    slug: 'business-email-protection',
    name: 'Business Email Protection',
    icon: 'Mail',
    tagline: 'Neutralize evasive phishing, zero-day attachments, and payload-free BEC before delivery to user inboxes.',
    description: 'High-speed API integration with Microsoft 365 and Google Workspace providing natural language analysis, sandbox detonation, and automated retroactive quarantine.',
    tiers: [
      {
        id: 'standard',
        name: 'Standard Gateway',
        tagline: 'Phishing & Malicious Attachment Filtering',
        idealFor: 'Growing organisations that need to catch malicious attachments, credential harvesting links, and spam.',
        features: [
          'API-based deployment for Microsoft 365 & Google Workspace (zero MX changes)',
          'Static and behavioral attachment inspection',
          'Credential harvesting link inspection & domain reputation analysis',
          'SPF, DKIM, and DMARC enforcement policies',
          'User reporting plug-in for Outlook and Gmail',
        ],
        highlights: ['Zero MX Changes', 'Phishing Blocker', 'M365 & Google Workspace'],
      },
      {
        id: 'pro',
        name: 'Advanced BEC Shield',
        tagline: 'AI Natural Language Processing & Behavioral Defense',
        idealFor: 'Enterprises defending against sophisticated Business Email Compromise, invoice fraud, and executive impersonation.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Everything in Standard Gateway plus:',
          'AI-powered Natural Language Processing (NLP) detecting payload-free BEC',
          'Executive and VIP impersonation detection with display-name heuristics',
          'Interactive attachment & link detonation in cloud sandbox',
          'Retroactive threat hunting across historical inboxes',
          'One-click automated mailbox clawback for newly classified threats',
        ],
        highlights: ['AI BEC Detection', 'Interactive Sandbox', 'Automated Clawback', 'VIP Protection'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Mission Assurance',
        tagline: 'Deep Campaign Forensics & 24/7 SOC Integration',
        idealFor: 'Financial institutions and high-visibility organizations requiring custom DLP, full forensic attribution, and dedicated email security engineers.',
        features: [
          'Everything in Advanced BEC Shield plus:',
          'Deep forensic analysis and threat actor attribution for targeted spear-phishing',
          'Custom mail filtering rules and data loss prevention (DLP) authoring',
          '24/7 Difaac SOC analyst escalation and false-positive verification',
          'On-premise / hybrid Microsoft Exchange server architecture support',
          'Dedicated email security engineer and quarterly tuning',
        ],
        highlights: ['Full Campaign Attribution', '24/7 SOC Integration', 'Custom DLP Policies', 'Hybrid Exchange'],
      },
    ],
    matrix: [
      {
        id: 'bep-features',
        name: 'Email Defense Capabilities',
        rows: [
          {
            title: 'Deployment Architecture',
            tooltip: 'Deployment mechanism for email traffic inspection.',
            tierValues: ['Cloud API (No MX Change)', 'Cloud API (No MX Change)', 'Cloud API + Hybrid On-Prem'],
          },
          {
            title: 'Malware & Link Sandbox Detonation',
            tooltip: 'Executing suspicious links and attachments inside an isolated sandbox to evaluate zero-day threats.',
            tierValues: ['Static Analysis', 'Full Detonation Sandbox', 'Full Detonation + Kernel Hooks'],
          },
          {
            title: 'Payload-Free BEC & Executive Impersonation Detection',
            tooltip: 'Natural language analysis to identify urgency, financial routing changes, and supplier deception without attachments.',
            tierValues: ['Basic Rules', 'Advanced AI NLP', 'Advanced AI + Custom VIP Tracking'],
          },
          {
            title: 'Retroactive Inbox Threat Hunting & Clawback',
            tooltip: 'Ability to search all enterprise inboxes retrospectively and delete or quarantine malicious emails automatically.',
            tierValues: [false, true, true],
          },
          {
            title: '24/7 SOC Analyst Verification & Attribution',
            tooltip: 'Every suspicious email reported by users is triaged and validated by human SOC analysts.',
            tierValues: [false, false, true],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do we need to alter our public DNS MX records to use Business Email Protection?',
        answer: 'No. Difaac connects directly into Microsoft 365 or Google Workspace through native cloud APIs. Setup requires no MX record changes and causes zero disruption to mail delivery.',
      },
      {
        question: 'How does Difaac identify Business Email Compromise (BEC) attacks that contain no links or attachments?',
        answer: 'Our proprietary natural language processing models inspect linguistic intent, tone, financial terminology, recipient communication history, and display-name spoofing to catch wire fraud and executive impersonation attempts.',
      },
    ],
  },

  'threat-intelligence': {
    slug: 'threat-intelligence',
    name: 'Threat Intelligence',
    icon: 'Radar',
    tagline: 'Track adversary infrastructure, zero-day exploits, and threat actors targeting your sector before attacks occur.',
    description: 'Actionable threat intelligence sourced from proprietary honeypots, dark web indexing, and regional high-tech crime investigations.',
    tiers: [
      {
        id: 'standard',
        name: 'Technical Feeds',
        tagline: 'High-Fidelity Automated IOCs',
        idealFor: 'Security teams seeking vetted, low-false-positive indicator feeds for immediate integration into firewalls, SIEM, and EDR.',
        features: [
          'High-confidence IP, domain, URL, and file hash blocklists',
          'Standard STIX/TAXII 2.1 protocol feeds and REST API delivery',
          'MITRE ATT&CK technique and sub-technique tagging',
          'Daily automated feed updates with confidence scoring',
        ],
        highlights: ['STIX/TAXII 2.1', 'Automated Blocklists', 'MITRE ATT&CK Tagged'],
      },
      {
        id: 'pro',
        name: 'Intelligence Suite',
        tagline: 'Adversary Profiling & Dark Web Monitoring',
        idealFor: 'Threat intelligence teams and SOCs requiring in-depth campaign tracking, actor profiles, and dark web exposure data.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Access to 700+ tracked nation-state and criminal threat actor dossiers',
          'Continuous deep/dark web forum, marketplace, and messaging channel monitoring',
          'Interactive threat graph pivoting and adversary infrastructure visualization',
          'Sector-specific threat notifications (Banking, Telecom, Government)',
          'Pre-compiled YARA, Sigma, and Snort detection rules',
        ],
        highlights: ['700+ Actor Profiles', 'Dark Web Tracking', 'Graph Investigation Workspace', 'YARA/Sigma Rules'],
      },
      {
        id: 'enterprise',
        name: 'Strategic Advisory',
        tagline: 'Bespoke Collection & Dedicated Intelligence Analyst',
        idealFor: 'National security organizations, regulatory bodies, and major financial enterprises requiring targeted collection.',
        features: [
          'Everything in Intelligence Suite plus:',
          'Direct access to Difaac Principal Threat Researchers and regional specialists',
          'Tailored collection requirements (Priority Intelligence Requirements - PIRs)',
          'Bespoke Requests for Information (RFIs) with guaranteed turn-around',
          'Threat actor infrastructure takedown and coordination assistance',
          'Executive briefings and board-level geopolitical threat summaries',
        ],
        highlights: ['Dedicated Intel Analyst', 'Bespoke RFIs', 'Targeted PIRs', 'Takedown Liaisons'],
      },
    ],
    matrix: [
      {
        id: 'ti-features',
        name: 'Intelligence Deliverables & Coverage',
        rows: [
          {
            title: 'STIX / TAXII 2.1 & REST API Delivery',
            tooltip: 'Standardized automated ingestion into SIEM, SOAR, and next-generation firewalls.',
            tierValues: [true, true, true],
          },
          {
            title: 'Tracked Threat Actor Dossiers',
            tooltip: 'Profiles covering past campaigns, TTPs, tooling, and known aliases.',
            tierValues: ['Basic Profiles', '700+ Groups with TTPs', '700+ Groups + Active Infrastructure Tracking'],
          },
          {
            title: 'Dark Web Marketplace & Channel Crawling',
            tooltip: 'Surveillance across illicit forums, leak sites, and encrypted chat channels for stolen credentials and compromised access.',
            tierValues: [false, true, true],
          },
          {
            title: 'Interactive Threat Graph Investigation Workspace',
            tooltip: 'Visual workspace allowing analysts to pivot across IPs, SSL certificates, domains, and malware hashes.',
            tierValues: [false, true, true],
          },
          {
            title: 'Bespoke Requests for Information (RFIs)',
            tooltip: 'Direct submission of investigative queries to Difaac researchers on specific threats or actors.',
            tierValues: [false, '2 RFIs / Quarter', 'Unlimited Priority RFIs'],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Where does Difaac source its threat intelligence?',
        answer: 'Our intelligence combines telemetry from proprietary sensor deployments across the Horn of Africa and the Middle East, active incident response engagements, digital forensic casework, honeypot arrays, and continuous automated crawling of deep and dark web channels.',
      },
      {
        question: 'How do Difaac feeds minimize false positives?',
        answer: 'Every indicator undergoes a rigorous multi-stage validation pipeline that evaluates historical age, benign domain whitelists, sinkhole validation, and confidence decay scoring before distribution.',
      },
    ],
  },

  'fraud-protection': {
    slug: 'fraud-protection',
    name: 'Fraud Protection',
    icon: 'ShieldCheck',
    tagline: 'Real-time client-side session security, behavioral biometrics, and anti-account takeover.',
    description: 'Stop automated bot networks, credential stuffing, and unauthorized account takeovers without introducing customer friction.',
    tiers: [
      {
        id: 'standard',
        name: 'Session Shield',
        tagline: 'Device Fingerprinting & Bot Filtering',
        idealFor: 'Web portals and e-commerce platforms seeking frictionless bot filtering and device reputation scoring.',
        features: [
          'Cross-platform device fingerprinting (Web & Mobile SDKs)',
          'Behavioral biometric analysis (mouse dynamics, keystrokes, touch gestures)',
          'Proxy, VPN, and TOR exit node detection',
          'Standard transaction and session risk scoring API',
        ],
        highlights: ['Device Fingerprinting', 'Bot Filtering', 'Frictionless Evaluation'],
      },
      {
        id: 'pro',
        name: 'Account & Payment Guard',
        tagline: 'Real-Time ATO & Transaction Risk Scoring',
        idealFor: 'Fintech platforms, retail banks, and telecom payment gateways preventing credential stuffing.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Real-time Account Takeover (ATO) prevention & credential stuffing defense',
          'Continuous session evaluation at login, payment, and account settings modification',
          'Fraud analyst investigation console with session replay capabilities',
          'Integration with Difaac global fraud ring intelligence network',
        ],
        highlights: ['Real-Time ATO Defense', 'Session Replay Console', 'Fraud Ring Intel'],
      },
      {
        id: 'enterprise',
        name: 'Financial Fusion Platform',
        tagline: 'Mule Account Graphs & Law Enforcement Evidence',
        idealFor: 'Tier-1 banks, payment processors, and central monetary switches managing complex fraud vectors.',
        features: [
          'Mule account network graph analysis & laundering ring detection',
          'Structured forensic evidence packaging for law enforcement and legal referral',
          'Custom machine learning models tuned to your specific transactional flows',
          'Dedicated fraud operations consultant and 24/7 rule authoring support',
        ],
        highlights: ['Mule Network Graph', 'Legal Evidence Export', 'Custom ML Tuning'],
      },
    ],
    matrix: [
      {
        id: 'fp-features',
        name: 'Fraud Detection Capabilities',
        rows: [
          {
            title: 'Device Fingerprinting & Browser Integrity',
            tooltip: 'Evaluates browser canvas, hardware, and operating system attributes to identify spoofed environments.',
            tierValues: [true, true, true],
          },
          {
            title: 'Behavioral Biometrics (Human vs Bot)',
            tooltip: 'Analyzes micro-movements, typing rhythm, and touch pressure to distinguish legitimate users from headless automation.',
            tierValues: [true, true, true],
          },
          {
            title: 'Account Takeover (ATO) Real-Time Mitigation',
            tooltip: 'Immediate step-up authentication or session termination when unauthorized access patterns are identified.',
            tierValues: ['Risk Score Only', 'Real-Time Intervention', 'Real-Time + Mule Graph'],
          },
          {
            title: 'Fraud Analyst Session Replay',
            tooltip: 'Visual recreation of suspicious user sessions allowing fraud teams to inspect behavioral indicators.',
            tierValues: [false, true, true],
          },
          {
            title: 'Mule Account & Laundering Graph Analysis',
            tooltip: 'Graph database linking accounts by shared device IDs, bank details, and behavioral attributes.',
            tierValues: [false, false, true],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Difaac Fraud Protection degrade mobile app or web page performance?',
        answer: 'No. Our SDK runs asynchronously with an ultra-lightweight client footprint (<35KB), evaluating risk signals in under 20 milliseconds without impacting page responsiveness.',
      },
    ],
  },

  'digital-risk-protection': {
    slug: 'digital-risk-protection',
    name: 'Digital Risk Protection',
    icon: 'Fingerprint',
    tagline: 'Monitor brand impersonation, fraudulent mobile apps, and leaked executive credentials across open, deep, and dark web perimeters.',
    description: 'Automated discovery of lookalike phishing domains, counterfeit profiles, and rapid managed takedown enforcement.',
    tiers: [
      {
        id: 'standard',
        name: 'Domain & Brand Guard',
        tagline: 'Typosquatting & Phishing Detection',
        idealFor: 'Growing enterprises needing early warning of lookalike domains and brand infringement.',
        features: [
          'Continuous monitoring of newly registered domains (typosquats & homoglyphs)',
          'Phishing kit detection and unauthorized logo usage identification',
          'Automated cease-and-desist notification generation',
          'Weekly brand exposure and risk metrics reporting',
        ],
        highlights: ['Typosquat Discovery', 'Phishing Lures', 'Automated C&D'],
      },
      {
        id: 'pro',
        name: 'Full Digital Protection',
        tagline: 'Managed Takedowns & Social Monitoring',
        idealFor: 'Enterprises that need a takedown carried through — registrar, host, and platform — rather than reported.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Full-service managed takedowns (95%+ success rate within 24 hours)',
          'Social media impersonation & rogue mobile application discovery',
          'Dark web leaked corporate credentials and source code monitoring',
          'Executive VIP digital footprint and personal data exposure tracking',
        ],
        highlights: ['Managed Takedowns (20/mo)', 'Dark Web Leaks', 'VIP Protection', 'Mobile App Scans'],
      },
      {
        id: 'enterprise',
        name: 'Global Brand Defense',
        tagline: 'Unlimited Takedowns & Campaign Attribution',
        idealFor: 'Multinational corporations, governmental ministries, and prominent financial institutions.',
        features: [
          'Unlimited international takedown requests across all jurisdictions',
          'Dedicated Brand Defense Analyst & direct legal registrar liaisons',
          'Counterfeit marketplace and unauthorized distributor scanning',
          'Adversary attribution identifying criminal infrastructure operators behind targeted campaigns',
        ],
        highlights: ['Unlimited Takedowns', 'Dedicated Analyst', 'Marketplace Counterfeit', 'Actor Attribution'],
      },
    ],
    matrix: [
      {
        id: 'drp-features',
        name: 'Protection Scope & Enforcement',
        rows: [
          {
            title: 'Domain Typosquatting & Phishing Detection',
            tooltip: 'Continuous monitoring of certificate transparency logs and newly registered domains for brand impersonation.',
            tierValues: [true, true, true],
          },
          {
            title: 'Takedowns Carried Through',
            tooltip: 'Human-led legal and technical takedown enforcement with global hosting providers and domain registries.',
            tierValues: ['Self-Service Tools', 'Included (20 / Month)', 'Unlimited Managed Takedowns'],
          },
          {
            title: 'Dark Web Leaked Credential Monitoring',
            tooltip: 'Real-time alert generation when corporate email passwords or session tokens appear in dark web dumps.',
            tierValues: ['Domain-Level', 'Full Corporate Exposure', 'Full Corporate + Executive VIP'],
          },
          {
            title: 'Fraudulent Mobile App Removal',
            tooltip: 'Identification and removal of malicious APKs and rogue apps impersonating your brand on official and third-party stores.',
            tierValues: [false, true, true],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'How fast are fraudulent phishing domains taken down?',
        answer: 'Through our direct registrar liaisons and established abuse-contact relationships, over 90% of verified phishing domains and rogue hostings are neutralized within 24 hours of confirmation.',
      },
    ],
  },

  'attack-surface-management': {
    slug: 'attack-surface-management',
    name: 'Attack Surface Management',
    icon: 'Globe',
    tagline: 'Continuous external asset discovery, exposure management, and exploitability risk prioritization.',
    description: 'Map and continuously monitor your internet-facing perimeter across IPs, cloud workloads, and open services from an adversary perspective with zero agents required.',
    tiers: [
      {
        id: 'standard',
        name: 'Perimeter Visibility',
        tagline: 'External Asset Mapping & Inventory',
        idealFor: 'Organizations looking to discover shadow IT and maintain an accurate catalog of public-facing assets.',
        features: [
          'Automated discovery of domains, subdomains, and public IP ranges',
          'Open port, service banner, and SSL certificate inventory',
          'Certificate expiration and basic misconfiguration alerts',
          'Monthly external attack surface posture score',
        ],
        highlights: ['Asset Discovery', 'Port Inventory', 'Certificate Alerts'],
      },
      {
        id: 'pro',
        name: 'Continuous Risk Scanner',
        tagline: 'Exploitability Scoring & Guided Remediation',
        idealFor: 'Security teams needing daily automated exposure validation and threat-informed fix prioritization.',
        popular: true,
        badge: 'Recommended',
        features: [
          'Daily continuous scans with zero-agent external reconnaissance',
          'Exploitability risk ranking based on actively weaponized CVEs',
          'Shadow IT and abandoned cloud storage bucket detection',
          'Actionable remediation playbooks and ticketing integrations (Jira, ServiceNow)',
        ],
        highlights: ['Daily Continuous Scans', 'Exploitability Scoring', 'Shadow IT Detection'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise Perimeter Control',
        tagline: 'Supply Chain & Subsidiary Risk Governance',
        idealFor: 'Conglomerates, financial groups, and government agencies managing complex subsidiaries and third-party vendor risk.',
        features: [
          'Subsidiary and M&A digital asset discovery and mapping',
          'Third-party supply chain risk scoring and continuous monitoring',
          'Custom API integration with SIEM and vulnerability management pipelines',
          'Dedicated attack surface strategist and quarterly architectural reviews',
        ],
        highlights: ['Supply Chain Risk', 'Subsidiary Mapping', 'Custom Integrations', 'Dedicated Strategist'],
      },
    ],
    matrix: [
      {
        id: 'asm-features',
        name: 'Discovery & Assessment Capabilities',
        rows: [
          {
            title: 'Domain & Subdomain Enumeration',
            tooltip: 'Passive and active enumeration of all corporate web assets and internal hostnames leaking to public DNS.',
            tierValues: [true, true, true],
          },
          {
            title: 'Continuous Exposure & Port Scanning Frequency',
            tooltip: 'How often ports and services are scanned across the IP ranges we have discovered.',
            tierValues: ['Weekly', 'Continuous Daily', 'Continuous Real-Time'],
          },
          {
            title: 'Exploitability Risk Prioritization',
            tooltip: 'Scoring based on whether a vulnerability is actively exploited by threat actors in the wild (EPSS / CISA KEV).',
            tierValues: ['CVSS Based', 'Threat Intel Correlated', 'Weaponized Adversary Priority'],
          },
          {
            title: 'Third-Party Supply Chain & Subsidiary Scans',
            tooltip: 'Ability to continuously evaluate risk profiles of acquired entities, partners, and critical suppliers.',
            tierValues: [false, false, true],
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Difaac Attack Surface Management require agent installation or firewall changes?',
        answer: 'No. Difaac ASM is 100% agentless and operates purely from an external attacker perspective using passive DNS, certificate transparency, and non-intrusive external reconnaissance.',
      },
    ],
  },
}
