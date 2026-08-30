/**
 * Full page content for the service pages.
 *
 * Services are engagements rather than platforms, so the page shape differs
 * from `product-pages.ts`: instead of comparison tables and capability tabs,
 * a service page leads with scope, a phased methodology, and the deliverables
 * a client actually receives at the end.
 *
 * `icon` values are keys of the shared icon map (`@/components/icons/icon-map`).
 */

export type ServicePageContent = {
  hero: {
    badge: string
    badgeIcon: string
    headlineLead: string
    headlineAccent: string
    description: string
  }
  facts: { icon: string; label: string; value: string }[]
  overview: {
    title: string
    body: string
    scope: { title: string; description: string }[]
  }
  phases: {
    heading: string
    description: string
    items: { title: string; description: string; duration: string }[]
  }
  deliverables: {
    heading: string
    description: string
    items: { icon: string; title: string; description: string }[]
  }
  audience: {
    heading: string
    items: { icon: string; title: string; description: string }[]
  }
  faqs: { question: string; answer: string }[]
  cta: { title: string; description: string }
}

export const servicePages: Record<string, ServicePageContent> = {
  'penetration-testing': {
    hero: {
      badge: 'Penetration Testing',
      badgeIcon: 'Terminal',
      headlineLead: 'Find the path ',
      headlineAccent: 'an attacker would take',
      description:
        'Manual testing of applications, networks, and infrastructure by senior operators, delivered as evidence you can act on rather than a scanner export.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '2 to 4 weeks' },
      { icon: 'Users', label: 'Team', value: 'Senior operators' },
      { icon: 'Crosshair', label: 'Approach', value: 'Manual, not scan-only' },
      { icon: 'FileText', label: 'Output', value: 'Findings with proof' },
    ],
    overview: {
      title: 'Testing that reflects how intrusions actually happen',
      body: 'Automated scanning finds known signatures. It does not chain a low-severity information leak into an authentication bypass, and it does not reason about your business logic. Difaac testers work manually against a defined scope, chaining findings the way an attacker would, and every reported issue carries reproduction steps and evidence.',
      scope: [
        { title: 'Web and API', description: 'Application logic, authentication, authorisation, and injection across web and API surfaces.' },
        { title: 'Network and infrastructure', description: 'External perimeter and internal network testing, including segmentation validation.' },
        { title: 'Cloud configuration', description: 'IAM, storage exposure, and misconfiguration across major cloud providers.' },
        { title: 'Mobile applications', description: 'iOS and Android client testing including local storage and transport security.' },
      ],
    },
    phases: {
      heading: 'How an engagement runs',
      description: 'Scoped up front, run against agreed rules of engagement, and reported with evidence.',
      items: [
        { title: 'Scoping', description: 'Targets, rules of engagement, testing windows, and escalation contacts agreed in writing before any testing begins.', duration: 'Week 0' },
        { title: 'Reconnaissance', description: 'Mapping the attack surface in scope, enumerating services, technologies, and entry points.', duration: 'Days 1-3' },
        { title: 'Exploitation', description: 'Manual testing and chaining of findings, with critical issues reported immediately rather than held for the report.', duration: 'Week 1-3' },
        { title: 'Reporting', description: 'Findings written up with reproduction steps, evidence, business impact, and prioritised remediation guidance.', duration: 'Final week' },
        { title: 'Retest', description: 'Remediated findings verified and the report updated to reflect closure.', duration: 'Post-fix' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'Evidence your engineers can act on and your auditors will accept.',
      items: [
        { icon: 'FileText', title: 'Technical report', description: 'Every finding with reproduction steps, evidence, and remediation guidance.' },
        { icon: 'Presentation', title: 'Executive summary', description: 'Risk narrative for leadership without the technical detail.' },
        { icon: 'BarChart3', title: 'Prioritised findings', description: 'Ranked by exploitability and business impact, not CVSS alone.' },
        { icon: 'Users', title: 'Debrief session', description: 'Live walkthrough with your engineers to answer questions on each finding.' },
        { icon: 'CheckCircle2', title: 'Retest report', description: 'Written confirmation of which findings are closed after remediation.' },
        { icon: 'ClipboardCheck', title: 'Attestation letter', description: 'Summary letter suitable for customers, auditors, and compliance evidence.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'ShieldCheck', title: 'Teams shipping to production', description: 'Validate a release or a major change before customers are exposed to it.' },
        { icon: 'FileCheck2', title: 'Regulated organisations', description: 'Satisfy testing requirements with evidence auditors will accept.' },
        { icon: 'Handshake', title: 'Teams under customer scrutiny', description: 'Answer enterprise security questionnaires with an independent attestation.' },
      ],
    },
    faqs: [
      {
        question: 'How is this different from a vulnerability scan?',
        answer:
          'A scanner reports known signatures on assets you point it at. It cannot chain a low-severity information leak into an authentication bypass or reason about your business logic. Difaac testing is manual against a defined scope, and every finding is validated by hand so you are not triaging false positives.',
      },
      {
        question: 'Will testing disrupt production?',
        answer:
          'Rules of engagement are agreed before testing starts, including which systems are in scope, testing windows, and what is explicitly off limits. Destructive testing is never run without written approval, and we hold escalation contacts throughout.',
      },
      {
        question: 'What happens if you find something critical mid-test?',
        answer:
          'Critical findings are reported immediately through the escalation path agreed at scoping, not held back for the final report. You get the chance to remediate while testing is still running.',
      },
      {
        question: 'Is a retest included?',
        answer:
          'Yes. Once you have remediated, findings are verified and the report is updated to record which issues are closed, which is usually what auditors and customers want to see.',
      },
      {
        question: 'Can you test cloud and mobile as well as web?',
        answer:
          'Yes. Scope commonly covers web and API, external and internal network, cloud configuration, and iOS and Android clients. Scope is agreed with you rather than fixed to a package.',
      },
    ],
    cta: {
      title: 'Ready to scope a penetration test?',
      description: 'Talk to a Difaac operator about targets, timing, and rules of engagement for your environment.',
    },
  },

  'vulnerability-assessment': {
    hero: {
      badge: 'Vulnerability Assessment',
      badgeIcon: 'Bug',
      headlineLead: 'Get a full picture of ',
      headlineAccent: 'your exposure',
      description:
        'Systematic scanning and human validation across your environment, prioritised by what an attacker could realistically use.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '1 to 2 weeks' },
      { icon: 'Boxes', label: 'Coverage', value: 'Full environment' },
      { icon: 'CheckCircle2', label: 'Validation', value: 'Human verified' },
      { icon: 'BarChart3', label: 'Output', value: 'Ranked remediation plan' },
    ],
    overview: {
      title: 'Breadth first, then the noise removed',
      body: 'Where penetration testing goes deep on a narrow scope, an assessment goes wide across the estate. Every finding is validated by an analyst before it reaches your report, so your team spends its time remediating real exposure rather than closing false positives.',
      scope: [
        { title: 'Internal network', description: 'Servers, workstations, and network devices across your internal estate.' },
        { title: 'External perimeter', description: 'Everything reachable from the internet, including forgotten infrastructure.' },
        { title: 'Cloud and containers', description: 'Cloud workloads, container images, and orchestration configuration.' },
        { title: 'Configuration review', description: 'Hardening baselines, patch levels, and insecure defaults.' },
      ],
    },
    phases: {
      heading: 'How an engagement runs',
      description: 'Discovery, validation, and a remediation plan your team can work through.',
      items: [
        { title: 'Asset discovery', description: 'Building an accurate inventory of what is actually in scope, including assets missing from your CMDB.', duration: 'Days 1-2' },
        { title: 'Scanning', description: 'Authenticated and unauthenticated scanning across the discovered estate.', duration: 'Days 3-5' },
        { title: 'Validation', description: 'Analysts confirm each finding by hand and discard false positives before reporting.', duration: 'Days 6-8' },
        { title: 'Prioritisation', description: 'Findings ranked by real-world exploitability and the criticality of the affected asset.', duration: 'Days 9-10' },
        { title: 'Handover', description: 'Remediation plan walked through with your team, with owners and sequencing agreed.', duration: 'Final day' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'A validated picture of exposure and a plan to close it.',
      items: [
        { icon: 'Boxes', title: 'Asset inventory', description: 'What is actually in your environment, including assets your records missed.' },
        { icon: 'FileText', title: 'Findings report', description: 'Validated vulnerabilities with evidence and affected asset detail.' },
        { icon: 'BarChart3', title: 'Prioritised plan', description: 'Remediation sequenced by exploitability and business impact.' },
        { icon: 'TrendingUp', title: 'Risk baseline', description: 'A measurable starting point to track improvement against.' },
        { icon: 'Workflow', title: 'Ticket-ready export', description: 'Findings formatted for import into your existing tracking workflow.' },
        { icon: 'Users', title: 'Remediation debrief', description: 'Session with your engineers on sequencing and effort.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Boxes', title: 'Teams without a baseline', description: 'Establish what exposure actually exists before building a remediation programme.' },
        { icon: 'FileCheck2', title: 'Compliance-driven teams', description: 'Meet periodic assessment requirements with validated, evidenced findings.' },
        { icon: 'Handshake', title: 'Post-acquisition estates', description: 'Assess an inherited environment before folding it into your controls.' },
      ],
    },
    faqs: [
      {
        question: 'How is this different from penetration testing?',
        answer:
          'An assessment goes wide across the whole estate to establish where exposure exists. A penetration test goes deep on a narrow scope to prove what an attacker could chain together. Most teams run an assessment first to get a baseline, then test the areas that matter most.',
      },
      {
        question: 'Do you just hand us raw scanner output?',
        answer:
          'No. Every finding is validated by an analyst before it reaches your report. Scanner output typically carries a large proportion of false positives, and passing that straight through would waste your engineers time rather than save it.',
      },
      {
        question: 'Does scanning require credentials?',
        answer:
          'Both authenticated and unauthenticated scanning are used. Authenticated scanning gives far more accurate patch-level and configuration detail, so we recommend it wherever you can provide service accounts.',
      },
      {
        question: 'How are findings prioritised?',
        answer:
          'By real-world exploitability and the criticality of the affected asset, rather than CVSS severity alone. A medium-severity issue on an internet-facing system usually matters more than a high-severity one on an isolated internal host.',
      },
      {
        question: 'Can findings go into our ticketing system?',
        answer:
          'Yes. Findings are exported in a format ready for import into your existing tracking workflow so remediation is managed where your team already works.',
      },
    ],
    cta: {
      title: 'Ready to establish your exposure baseline?',
      description: 'Talk to a Difaac specialist about scope, credentials, and timing for an assessment.',
    },
  },

  'red-teaming': {
    hero: {
      badge: 'Red Teaming',
      badgeIcon: 'Swords',
      headlineLead: 'Test detection, ',
      headlineAccent: 'not just prevention',
      description:
        'A goal-oriented adversary simulation that tests your people, process, and technology together, and measures whether your defenders actually catch it.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '4 to 8 weeks' },
      { icon: 'Crosshair', label: 'Model', value: 'Objective-based' },
      { icon: 'Eye', label: 'Awareness', value: 'Blue team blind' },
      { icon: 'BarChart3', label: 'Measures', value: 'Detection and response' },
    ],
    overview: {
      title: 'The question is not whether you can be breached',
      body: 'A red team engagement assumes a determined adversary and asks a different question: when they get in, do you notice, how quickly, and what do you do about it? The operation runs against an agreed objective rather than a checklist, and your defenders are not told it is happening.',
      scope: [
        { title: 'Initial access', description: 'Phishing, exposed services, and supply chain paths into the environment.' },
        { title: 'Lateral movement', description: 'Privilege escalation and movement toward the agreed objective.' },
        { title: 'Detection testing', description: 'Which actions your tooling and analysts caught, and which passed unnoticed.' },
        { title: 'Response testing', description: 'How your team escalated, contained, and communicated once alerted.' },
      ],
    },
    phases: {
      heading: 'How an engagement runs',
      description: 'Objective agreed with a small control group, then executed as a real adversary would.',
      items: [
        { title: 'Objective setting', description: 'A meaningful goal is agreed with a small control group, along with hard boundaries and abort conditions.', duration: 'Week 0' },
        { title: 'Reconnaissance', description: 'External footprinting of infrastructure, people, and supply chain, exactly as an adversary would.', duration: 'Week 1-2' },
        { title: 'Initial access', description: 'Establishing a foothold through the most viable path identified during reconnaissance.', duration: 'Week 2-3' },
        { title: 'Execution', description: 'Movement toward the objective while logging every action and timestamp for later correlation.', duration: 'Week 3-6' },
        { title: 'Purple team debrief', description: 'Operator timeline replayed alongside your detection data so gaps are identified together.', duration: 'Final week' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'A measured view of detection and response, not just a list of weaknesses.',
      items: [
        { icon: 'FileText', title: 'Attack narrative', description: 'The full operation told as a timeline, from reconnaissance to objective.' },
        { icon: 'Clock', title: 'Detection timeline', description: 'What was detected, at what point, and what went unnoticed entirely.' },
        { icon: 'Target', title: 'Detection gap analysis', description: 'Specific gaps in coverage mapped to MITRE ATT&CK techniques.' },
        { icon: 'Users', title: 'Purple team session', description: 'Joint replay with your defenders so learning is shared, not just reported.' },
        { icon: 'ClipboardCheck', title: 'Detection engineering input', description: 'Concrete rule and logging recommendations to close the gaps found.' },
        { icon: 'Presentation', title: 'Executive briefing', description: 'Board-level readout on organisational resilience.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Activity', title: 'Teams with a working SOC', description: 'Most valuable once you have detection in place and want to know if it works.' },
        { icon: 'ShieldCheck', title: 'Mature security programmes', description: 'Validate controls end to end rather than component by component.' },
        { icon: 'Siren', title: 'Teams rehearsing response', description: 'Exercise escalation and containment under realistic pressure.' },
      ],
    },
    faqs: [
      {
        question: 'How is red teaming different from a penetration test?',
        answer:
          'A penetration test finds as many vulnerabilities as possible in a defined scope, and your team usually knows it is happening. A red team works toward a specific objective using whatever viable path exists, and your defenders are not told, so the engagement measures detection and response as well as vulnerability.',
      },
      {
        question: 'Should our SOC know about it?',
        answer:
          'No. Only a small control group is aware, which is what makes the detection results meaningful. The control group holds the abort conditions and can stop the operation at any point.',
      },
      {
        question: 'What if a real incident happens during the engagement?',
        answer:
          'The control group can confirm immediately whether observed activity is ours, which lets your team distinguish the exercise from a genuine intrusion without ending the engagement unnecessarily.',
      },
      {
        question: 'Do we need a mature SOC before this is worthwhile?',
        answer:
          'You need detection capability in place for the results to be useful. If you have limited monitoring today, an assessment or penetration test usually delivers more value first, and red teaming is the right next step once detection exists.',
      },
      {
        question: 'What is a purple team debrief?',
        answer:
          'A joint session where the operator timeline is replayed alongside your own detection data. Your defenders see exactly what was happening at each point and what their tooling did or did not show, which is where most of the learning comes from.',
      },
    ],
    cta: {
      title: 'Ready to test whether you would notice?',
      description: 'Talk to a Difaac operator about objectives, boundaries, and control group for a red team engagement.',
    },
  },

  'compromise-assessment': {
    hero: {
      badge: 'Compromise Assessment',
      badgeIcon: 'Search',
      headlineLead: 'Confirm you are ',
      headlineAccent: 'not already compromised',
      description:
        'A forensic sweep of your environment to find intrusion that is already present but has not yet triggered an alert.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '2 to 3 weeks' },
      { icon: 'ScanSearch', label: 'Method', value: 'Forensic sweep' },
      { icon: 'Radar', label: 'Informed by', value: 'Actor intelligence' },
      { icon: 'FileCheck2', label: 'Output', value: 'Evidenced verdict' },
    ],
    overview: {
      title: 'Dwell time is measured in months, not days',
      body: 'Intrusions frequently sit undetected long enough to matter. A compromise assessment hunts for evidence of existing intrusion across endpoint, network, and identity telemetry, using indicators drawn from Difaac threat actor tracking, and gives you an evidenced answer either way.',
      scope: [
        { title: 'Endpoint forensics', description: 'Persistence mechanisms, suspicious binaries, and execution artefacts across hosts.' },
        { title: 'Network telemetry', description: 'Beaconing, command and control traffic, and unexpected egress patterns.' },
        { title: 'Identity and access', description: 'Anomalous authentication, privilege changes, and dormant account abuse.' },
        { title: 'Log review', description: 'Historical log analysis for activity that predates current monitoring.' },
      ],
    },
    phases: {
      heading: 'How an engagement runs',
      description: 'Collect broadly, hunt against known tradecraft, and report with evidence.',
      items: [
        { title: 'Deployment', description: 'Forensic collection deployed across a representative set of hosts and telemetry sources.', duration: 'Days 1-3' },
        { title: 'Collection', description: 'Endpoint artefacts, network telemetry, and identity logs gathered for analysis.', duration: 'Days 4-7' },
        { title: 'Hunting', description: 'Analysts hunt against current adversary tradecraft and Difaac actor indicators.', duration: 'Week 2' },
        { title: 'Validation', description: 'Suspicious findings investigated to confirm or rule out genuine compromise.', duration: 'Week 2-3' },
        { title: 'Reporting', description: 'Evidenced verdict delivered, with an immediate handover to incident response if compromise is confirmed.', duration: 'Final days' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'A defensible answer, and a route straight into response if the answer is yes.',
      items: [
        { icon: 'FileCheck2', title: 'Assessment verdict', description: 'A clear, evidenced statement on whether compromise was found.' },
        { icon: 'FileText', title: 'Evidence package', description: 'Forensic artefacts supporting every conclusion in the report.' },
        { icon: 'AlertCircle', title: 'Indicators of compromise', description: 'Any IOCs identified, ready to load into your detection tooling.' },
        { icon: 'Siren', title: 'Response handover', description: 'Immediate escalation into incident response if compromise is confirmed.' },
        { icon: 'Target', title: 'Detection gaps', description: 'Where your existing monitoring would have missed the activity found.' },
        { icon: 'ClipboardCheck', title: 'Hardening recommendations', description: 'Prioritised changes to reduce the chance of recurrence.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'AlertTriangle', title: 'Teams with suspicion but no proof', description: 'Odd behaviour, an unexplained alert, or intelligence suggesting you were targeted.' },
        { icon: 'Handshake', title: 'Pre-acquisition due diligence', description: 'Establish whether an acquisition target is already compromised before you inherit it.' },
        { icon: 'ShieldCheck', title: 'Post-breach assurance', description: 'Confirm an environment is clean after remediating a known incident.' },
      ],
    },
    faqs: [
      {
        question: 'How is this different from incident response?',
        answer:
          'Incident response starts when you already know something has happened. A compromise assessment starts from uncertainty and looks for evidence of intrusion you have not detected. If we find an active compromise, the engagement converts into incident response immediately.',
      },
      {
        question: 'Do you need to deploy agents everywhere?',
        answer:
          'Collection is deployed across a representative set of hosts rather than every endpoint, weighted toward the systems most likely to be targeted. The exact footprint is agreed with you during scoping.',
      },
      {
        question: 'What if you find an active intrusion?',
        answer:
          'You are notified immediately through the escalation path agreed at scoping, not at the end of the engagement. The team can move directly into containment rather than handing you a report and leaving.',
      },
      {
        question: 'How far back can you look?',
        answer:
          'That depends on your log retention. Endpoint forensic artefacts often reveal activity well beyond your log window, but longer retention meaningfully improves how far back the historical analysis can reach.',
      },
      {
        question: 'What does a clean result actually prove?',
        answer:
          'It means no evidence of compromise was found across the telemetry and hosts in scope, using current adversary tradecraft and indicators. The report is explicit about scope and coverage so the conclusion is defensible rather than absolute.',
      },
    ],
    cta: {
      title: 'Need to know whether you are already compromised?',
      description: 'Talk to a Difaac analyst about scope, telemetry, and timing for a compromise assessment.',
    },
  },

  'ai-red-teaming': {
    hero: {
      badge: 'AI Red Teaming',
      badgeIcon: 'Cpu',
      headlineLead: 'Stress-test ',
      headlineAccent: 'your AI systems',
      description:
        'Adversarial testing of models and AI-integrated applications for prompt injection, data exposure, and misuse of the tools you gave them.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '2 to 4 weeks' },
      { icon: 'Cpu', label: 'Targets', value: 'Models and integrations' },
      { icon: 'Crosshair', label: 'Approach', value: 'Adversarial testing' },
      { icon: 'FileText', label: 'Output', value: 'Findings and guardrails' },
    ],
    overview: {
      title: 'The model is rarely the whole attack surface',
      body: 'Most real risk in AI systems sits at the integration boundary: what the model can retrieve, what tools it can call, and what it will do when instructions arrive inside untrusted content. Testing covers the model and the application around it, because that is where consequences live.',
      scope: [
        { title: 'Prompt injection', description: 'Direct and indirect injection, including instructions hidden in retrieved documents.' },
        { title: 'Data exposure', description: 'Leakage of system prompts, training data, and other users context.' },
        { title: 'Tool and agent abuse', description: 'Misuse of the actions and integrations the model is permitted to call.' },
        { title: 'Guardrail bypass', description: 'Circumvention of safety filters and content controls in production conditions.' },
      ],
    },
    phases: {
      heading: 'How an engagement runs',
      description: 'Map the system, attack it adversarially, then harden what broke.',
      items: [
        { title: 'System mapping', description: 'Understanding the model, its prompts, retrieval sources, tools, and trust boundaries.', duration: 'Days 1-3' },
        { title: 'Threat modelling', description: 'Identifying what an attacker would want and which paths could plausibly reach it.', duration: 'Days 4-6' },
        { title: 'Adversarial testing', description: 'Structured injection, extraction, and tool abuse attempts against the live system.', duration: 'Week 2-3' },
        { title: 'Impact validation', description: 'Confirming what each successful attack actually achieves in business terms.', duration: 'Week 3' },
        { title: 'Hardening review', description: 'Concrete guardrail, prompt, and architecture recommendations for the issues found.', duration: 'Final week' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'Reproducible attacks and the specific changes that close them.',
      items: [
        { icon: 'FileText', title: 'Findings report', description: 'Every successful attack with the exact inputs needed to reproduce it.' },
        { icon: 'Target', title: 'Threat model', description: 'Documented trust boundaries and attack paths for the system as built.' },
        { icon: 'ShieldCheck', title: 'Guardrail recommendations', description: 'Specific mitigations at prompt, application, and architecture level.' },
        { icon: 'ClipboardCheck', title: 'Regression test set', description: 'The successful attacks packaged so you can retest after every change.' },
        { icon: 'Users', title: 'Engineering debrief', description: 'Walkthrough with the team who built the system.' },
        { icon: 'Presentation', title: 'Risk summary', description: 'Readout for leadership on AI-specific exposure.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Cpu', title: 'Teams shipping AI features', description: 'Validate an assistant or agent before it reaches customers.' },
        { icon: 'Database', title: 'RAG and agent architectures', description: 'Systems where the model retrieves data or calls tools on a users behalf.' },
        { icon: 'FileCheck2', title: 'Regulated AI deployments', description: 'Evidence of adversarial testing for governance and audit requirements.' },
      ],
    },
    faqs: [
      {
        question: 'Do you test the model itself or the application around it?',
        answer:
          'Both, but the application boundary is usually where the real risk is. A model that can be talked into saying something unhelpful matters far less than one that can be induced to call a tool, read another users data, or act on instructions hidden in a retrieved document.',
      },
      {
        question: 'What is indirect prompt injection?',
        answer:
          'Instructions planted in content the model retrieves rather than typed by the user, for example inside a document, web page, or email the system ingests. It is one of the most consequential AI-specific attack classes because the user never sees the instruction.',
      },
      {
        question: 'Does this work with any model provider?',
        answer:
          'Yes. Testing targets your system as deployed, so it applies regardless of which provider or model you have built on, including self-hosted and open-weight deployments.',
      },
      {
        question: 'Can we retest after we make changes?',
        answer:
          'Yes, and the deliverables are designed for it. Successful attacks are packaged as a regression test set so your team can rerun them after every prompt or architecture change rather than commissioning a new engagement each time.',
      },
      {
        question: 'Will testing affect our production system?',
        answer:
          'Scope and environment are agreed up front. Testing commonly runs against a staging environment that mirrors production, and where production testing is required it runs under agreed rules of engagement with escalation contacts in place.',
      },
    ],
    cta: {
      title: 'Ready to stress-test your AI systems?',
      description: 'Talk to a Difaac specialist about scope and environment for an AI red team engagement.',
    },
  },

  'incident-response': {
    hero: {
      badge: 'Incident Response',
      badgeIcon: 'Siren',
      headlineLead: 'Contain and recover, ',
      headlineAccent: 'fast',
      description:
        'An on-demand response team that engages immediately to contain an active incident, understand its scope, and get you back to operating.',
    },
    facts: [
      { icon: 'Clock', label: 'Engagement', value: 'Immediate' },
      { icon: 'Users', label: 'Availability', value: '24/7 hotline' },
      { icon: 'Siren', label: 'Priority', value: 'Containment first' },
      { icon: 'FileCheck2', label: 'Output', value: 'Evidenced timeline' },
    ],
    overview: {
      title: 'The first hours decide how bad it gets',
      body: 'When an intrusion is live, the order of operations matters. Difaac responders work containment first to cut attacker access, then establish scope and root cause, then support recovery. Evidence is preserved throughout, so the investigation stands up afterwards for insurers, regulators, and your board.',
      scope: [
        { title: 'Containment', description: 'Isolating affected systems and cutting attacker access and persistence.' },
        { title: 'Scope determination', description: 'Establishing what was reached, what was taken, and what remains at risk.' },
        { title: 'Eradication', description: 'Removing footholds, backdoors, and persistence across the environment.' },
        { title: 'Recovery support', description: 'Guiding safe restoration so you do not restore the intrusion with the data.' },
      ],
    },
    phases: {
      heading: 'How a response runs',
      description: 'Triage on contact, contain early, and investigate without losing evidence.',
      items: [
        { title: 'Engagement', description: 'Initial triage call to understand what is happening and stand up the response team.', duration: 'Hour 0' },
        { title: 'Containment', description: 'Immediate action to cut attacker access and stop the incident spreading further.', duration: 'Hours 1-24' },
        { title: 'Investigation', description: 'Forensic analysis to establish entry point, timeline, and the full scope of access.', duration: 'Days 2-7' },
        { title: 'Eradication', description: 'Removing all persistence and confirming the attacker no longer holds access.', duration: 'Week 1-2' },
        { title: 'Recovery and review', description: 'Supporting safe restoration and delivering a lessons-learned review.', duration: 'Week 2+' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'Containment first, then the record you will need afterwards.',
      items: [
        { icon: 'Siren', title: 'Containment actions', description: 'Attacker access cut and the incident stopped from spreading.' },
        { icon: 'Clock', title: 'Incident timeline', description: 'What happened, in what order, established from forensic evidence.' },
        { icon: 'Target', title: 'Root cause analysis', description: 'How the attacker got in and what allowed them to stay.' },
        { icon: 'FileCheck2', title: 'Evidence package', description: 'Preserved forensic evidence for insurers, regulators, and legal counsel.' },
        { icon: 'AlertCircle', title: 'Impact assessment', description: 'What data and systems were reached, to inform notification decisions.' },
        { icon: 'ClipboardCheck', title: 'Lessons learned', description: 'Prioritised changes to prevent the same path being used again.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Siren', title: 'Teams with an active incident', description: 'Ransomware, confirmed intrusion, or an alert you cannot explain.' },
        { icon: 'ShieldCheck', title: 'Teams without in-house IR', description: 'Access a response capability without maintaining one year-round.' },
        { icon: 'FileSignature', title: 'Retainer holders', description: 'Pre-agreed terms so response starts on the call, not after procurement.' },
      ],
    },
    faqs: [
      {
        question: 'How quickly can you engage?',
        answer:
          'The hotline is staffed 24/7 and triage starts on the first call. Retainer clients have terms already agreed, so work begins immediately rather than waiting on contracting, which is usually the difference of a day or more.',
      },
      {
        question: 'Should we shut everything down before you arrive?',
        answer:
          'Call first. Powering systems off can destroy volatile evidence and sometimes triggers destructive payloads. Triage will tell you what to isolate and what to leave running, so containment does not cost you the investigation.',
      },
      {
        question: 'Do you handle ransom negotiation?',
        answer:
          'The team supports the decision with facts about what was actually taken and encrypted, and coordinates with your insurers and legal counsel. Whether to engage or pay is your decision, made with counsel, and we make sure it is informed by evidence.',
      },
      {
        question: 'Will the evidence stand up for regulators and insurers?',
        answer:
          'Yes. Evidence is preserved to forensic standards throughout, including during containment, and the package is prepared with regulatory notification and insurance claims in mind.',
      },
      {
        question: 'What is the benefit of a retainer?',
        answer:
          'Terms, contacts, and escalation paths are agreed in advance, so a response starts on the call rather than after procurement. Retainers also include pre-incident familiarisation with your environment, which shortens triage significantly.',
      },
    ],
    cta: {
      title: 'Dealing with an active incident?',
      description: 'Contact the Difaac response team now, or set up a retainer so terms are agreed before you need them.',
    },
  },

  'digital-forensics': {
    hero: {
      badge: 'Digital Forensics',
      badgeIcon: 'Fingerprint',
      headlineLead: 'Understand ',
      headlineAccent: 'exactly what happened',
      description:
        'Forensic investigation that reconstructs the timeline and scope of an incident to a standard that holds up in legal and regulatory proceedings.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '2 to 6 weeks' },
      { icon: 'FileCheck2', label: 'Standard', value: 'Evidentiary' },
      { icon: 'ClipboardCheck', label: 'Handling', value: 'Chain of custody' },
      { icon: 'Scale', label: 'Output', value: 'Defensible findings' },
    ],
    overview: {
      title: 'Findings that survive challenge',
      body: 'Where incident response is about stopping an attack, forensics is about proving what occurred. Evidence is acquired and handled under documented chain of custody, analysis is reproducible, and conclusions are stated with the confidence the evidence actually supports.',
      scope: [
        { title: 'Disk and memory', description: 'Full acquisition and analysis of storage media and volatile memory.' },
        { title: 'Log reconstruction', description: 'Correlating system, application, and network logs into a single timeline.' },
        { title: 'Malware analysis', description: 'Reverse engineering recovered samples to establish capability and intent.' },
        { title: 'Data exfiltration', description: 'Establishing what data was accessed and what actually left the environment.' },
      ],
    },
    phases: {
      heading: 'How an investigation runs',
      description: 'Acquire soundly, analyse reproducibly, and report defensibly.',
      items: [
        { title: 'Preservation', description: 'Forensically sound acquisition of evidence under documented chain of custody.', duration: 'Days 1-3' },
        { title: 'Examination', description: 'Analysis of acquired images, memory, and logs for relevant artefacts.', duration: 'Week 1-3' },
        { title: 'Reconstruction', description: 'Building a defensible timeline of events from correlated evidence.', duration: 'Week 3-4' },
        { title: 'Attribution', description: 'Where evidence supports it, linking activity to known actors and campaigns.', duration: 'Week 4-5' },
        { title: 'Reporting', description: 'Findings documented to evidentiary standard, with expert testimony available if required.', duration: 'Final week' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'A documented account that stands up to scrutiny.',
      items: [
        { icon: 'Clock', title: 'Forensic timeline', description: 'Reconstructed sequence of events supported by evidence at each step.' },
        { icon: 'FileCheck2', title: 'Evidence inventory', description: 'Every artefact acquired, with chain of custody documentation.' },
        { icon: 'Database', title: 'Data impact analysis', description: 'What was accessed and what was actually exfiltrated.' },
        { icon: 'Radar', title: 'Attribution assessment', description: 'Actor or campaign linkage where the evidence supports it.' },
        { icon: 'Scale', title: 'Expert report', description: 'Findings written to a standard suitable for legal and regulatory use.' },
        { icon: 'Users', title: 'Expert testimony', description: 'Investigator available to explain findings in proceedings if required.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Scale', title: 'Legal and regulatory matters', description: 'Where findings will be challenged and must be defensible.' },
        { icon: 'AlertTriangle', title: 'Insider incidents', description: 'Data theft, policy breach, or misuse by someone with legitimate access.' },
        { icon: 'FileCheck2', title: 'Breach notification decisions', description: 'Establish what actually left before deciding what must be disclosed.' },
      ],
    },
    faqs: [
      {
        question: 'How is this different from incident response?',
        answer:
          'Incident response prioritises stopping the attack and getting you operating again. Forensics prioritises establishing exactly what happened to an evidentiary standard. They often run together, with response containing the incident while forensics preserves and analyses the evidence.',
      },
      {
        question: 'Why does chain of custody matter?',
        answer:
          'If findings are challenged in legal or regulatory proceedings, the handling of evidence is scrutinised as closely as the conclusions. Documented chain of custody from acquisition onward is what keeps the analysis defensible.',
      },
      {
        question: 'Can you determine whether data actually left?',
        answer:
          'Often yes, depending on available telemetry. There is an important distinction between data an attacker could access and data that demonstrably left the environment, and that distinction frequently drives notification obligations. Findings state which is which rather than blurring them.',
      },
      {
        question: 'Will you support legal proceedings?',
        answer:
          'Yes. Reports are written to a standard suitable for legal and regulatory use, and the investigator who performed the analysis can provide expert testimony where required.',
      },
      {
        question: 'What if evidence was already lost?',
        answer:
          'Investigations frequently begin after some evidence is gone. Forensic artefacts often persist in places people do not expect, and the report is explicit about coverage limitations so conclusions are not overstated.',
      },
    ],
    cta: {
      title: 'Need a defensible account of what happened?',
      description: 'Talk to a Difaac investigator about evidence preservation and scope for a forensic investigation.',
    },
  },

  'technical-training': {
    hero: {
      badge: 'Technical Training',
      badgeIcon: 'GraduationCap',
      headlineLead: 'Build skills ',
      headlineAccent: 'your team keeps',
      description:
        'Hands-on training for analysts, engineers, and responders, taught by practitioners using real adversary tradecraft rather than slideware.',
    },
    facts: [
      { icon: 'Clock', label: 'Format', value: '2 to 5 days' },
      { icon: 'Terminal', label: 'Delivery', value: 'Hands-on labs' },
      { icon: 'Users', label: 'Taught by', value: 'Practising operators' },
      { icon: 'Award', label: 'Output', value: 'Assessed competency' },
    ],
    overview: {
      title: 'Taught by people who do the work',
      body: 'Courses are built and delivered by the operators and analysts who run Difaac engagements, using tradecraft from current investigations. Most of the time is spent in lab environments rather than lecture, because capability comes from doing the work under guidance.',
      scope: [
        { title: 'Threat hunting', description: 'Hypothesis-driven hunting across endpoint and network telemetry.' },
        { title: 'Incident response', description: 'Triage, containment, and evidence handling under time pressure.' },
        { title: 'Digital forensics', description: 'Disk, memory, and log analysis with forensically sound handling.' },
        { title: 'Offensive techniques', description: 'Attacker tradecraft taught so defenders can recognise it in their own data.' },
      ],
    },
    phases: {
      heading: 'How a programme runs',
      description: 'Scoped to your team, delivered hands-on, and reinforced after the room empties.',
      items: [
        { title: 'Needs assessment', description: 'Establishing current capability and the gap the training needs to close.', duration: 'Pre-course' },
        { title: 'Tailoring', description: 'Course content and lab scenarios adapted to your stack and threat profile.', duration: 'Pre-course' },
        { title: 'Delivery', description: 'Instructor-led sessions with the majority of time spent in hands-on labs.', duration: '2-5 days' },
        { title: 'Assessment', description: 'Practical exercises that measure capability rather than recall.', duration: 'Final day' },
        { title: 'Reinforcement', description: 'Lab access retained after the course so skills are practised, not forgotten.', duration: 'Post-course' },
      ],
    },
    deliverables: {
      heading: 'What your team receives',
      description: 'Capability that persists after the course ends.',
      items: [
        { icon: 'Terminal', title: 'Lab environment', description: 'Retained access to practise scenarios after the course.' },
        { icon: 'BookOpen', title: 'Course materials', description: 'Full reference materials and playbooks to take back to the team.' },
        { icon: 'Award', title: 'Competency assessment', description: 'Practical evaluation of what each attendee can actually do.' },
        { icon: 'ClipboardCheck', title: 'Skills gap report', description: 'Where the team is strong and where further development is needed.' },
        { icon: 'FileText', title: 'Playbook templates', description: 'Response and hunting playbooks adaptable to your environment.' },
        { icon: 'GraduationCap', title: 'Certificates', description: 'Completion records for professional development and compliance.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Activity', title: 'SOC analysts', description: 'Build hunting and triage capability beyond alert queue processing.' },
        { icon: 'Siren', title: 'Incident responders', description: 'Practise containment and evidence handling before a real incident.' },
        { icon: 'Users', title: 'Growing security teams', description: 'Bring new hires to operational capability faster.' },
      ],
    },
    faqs: [
      {
        question: 'Is training delivered on site or remotely?',
        answer:
          'Both. On-site delivery works well for whole-team sessions, while remote delivery suits distributed teams. Lab environments are cloud-hosted either way, so the hands-on experience is identical.',
      },
      {
        question: 'Can courses be tailored to our environment?',
        answer:
          'Yes. Content and lab scenarios are adapted to your stack, tooling, and threat profile during the pre-course phase, so exercises reflect the systems your team actually defends.',
      },
      {
        question: 'How much is lecture versus hands-on?',
        answer:
          'The majority of course time is spent in labs. Capability comes from doing the work under guidance, so instruction is kept tight and practice is where the time goes.',
      },
      {
        question: 'Do attendees keep lab access afterwards?',
        answer:
          'Yes. Lab access is retained after the course so scenarios can be repeated. Skills decay quickly without practice, and retained access is what makes the training stick.',
      },
      {
        question: 'What experience level is assumed?',
        answer:
          'Courses run at foundational through advanced levels. The needs assessment before delivery establishes current capability so attendees are placed at the right level rather than sitting through material they already know.',
      },
    ],
    cta: {
      title: 'Ready to build capability in your team?',
      description: 'Talk to Difaac about a needs assessment and a training programme scoped to your team.',
    },
  },

  'management-masterclasses': {
    hero: {
      badge: 'Management Masterclasses',
      badgeIcon: 'Presentation',
      headlineLead: 'Brief leadership on ',
      headlineAccent: 'real risk',
      description:
        'Executive sessions that translate technical risk into the decisions boards and leadership teams actually have to make.',
    },
    facts: [
      { icon: 'Clock', label: 'Format', value: 'Half or full day' },
      { icon: 'Users', label: 'Audience', value: 'Board and executives' },
      { icon: 'Presentation', label: 'Style', value: 'Scenario-led' },
      { icon: 'ClipboardCheck', label: 'Output', value: 'Decision framework' },
    ],
    overview: {
      title: 'Leadership does not need to read packet captures',
      body: 'Boards are accountable for cyber risk but are rarely given it in terms they can act on. These sessions use real incidents and scenario exercises to build the judgement leadership needs: what questions to ask, where to invest, and how to decide under pressure during an incident.',
      scope: [
        { title: 'Threat landscape', description: 'What is actually targeting your sector, stripped of vendor marketing.' },
        { title: 'Risk quantification', description: 'Expressing cyber risk in financial and operational terms.' },
        { title: 'Incident decision-making', description: 'The decisions leadership owns during a live incident, rehearsed in advance.' },
        { title: 'Regulatory obligations', description: 'Disclosure, notification, and governance duties leadership carries personally.' },
      ],
    },
    phases: {
      heading: 'How a session runs',
      description: 'Grounded in your sector, rehearsed through scenarios, and left with a framework.',
      items: [
        { title: 'Context setting', description: 'Understanding your sector, risk profile, and the decisions leadership currently faces.', duration: 'Pre-session' },
        { title: 'Landscape briefing', description: 'What is genuinely targeting organisations like yours, with real case detail.', duration: 'Session part 1' },
        { title: 'Scenario exercise', description: 'A tabletop incident where the group makes the calls leadership would actually own.', duration: 'Session part 2' },
        { title: 'Decision framework', description: 'Working through investment, escalation, and disclosure decision-making.', duration: 'Session part 3' },
        { title: 'Action planning', description: 'Agreeing what changes in governance and reporting as a result.', duration: 'Close' },
      ],
    },
    deliverables: {
      heading: 'What leadership receives',
      description: 'Judgement and structure, not a slide deck.',
      items: [
        { icon: 'Presentation', title: 'Sector briefing', description: 'Written threat briefing specific to your industry and profile.' },
        { icon: 'ClipboardCheck', title: 'Scenario debrief', description: 'What the group decided, and where those decisions would have held or failed.' },
        { icon: 'Scale', title: 'Decision framework', description: 'Structure for making escalation and disclosure calls under pressure.' },
        { icon: 'BarChart3', title: 'Board reporting template', description: 'A format for cyber risk reporting leadership can actually interrogate.' },
        { icon: 'FileCheck2', title: 'Governance checklist', description: 'The obligations and questions leadership is accountable for.' },
        { icon: 'Users', title: 'Follow-up access', description: 'Direct line to the facilitator for questions after the session.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Landmark', title: 'Boards and non-executives', description: 'Build the judgement to interrogate cyber risk reporting properly.' },
        { icon: 'Users', title: 'Executive teams', description: 'Rehearse the decisions you would own during a live incident.' },
        { icon: 'ShieldCheck', title: 'CISOs briefing upward', description: 'Establish shared language with the board before an incident forces it.' },
      ],
    },
    faqs: [
      {
        question: 'Do attendees need a technical background?',
        answer:
          'No. Sessions are built for people who are accountable for cyber risk without being practitioners. Technical detail is included only where it changes a decision leadership has to make.',
      },
      {
        question: 'What does the scenario exercise involve?',
        answer:
          'A tabletop incident where the group works through the decisions leadership actually owns: when to notify, whether to engage counsel, what to tell customers, and how to weigh operational disruption. There is no technical remediation to perform.',
      },
      {
        question: 'Can this be tailored to our sector?',
        answer:
          'Yes, and it should be. The threat briefing is built around what is genuinely targeting organisations like yours, using real case detail rather than generic industry statistics.',
      },
      {
        question: 'How long is a session?',
        answer:
          'Half-day and full-day formats are both available. Full day allows a longer scenario exercise, which is usually where the most valuable discussion happens.',
      },
      {
        question: 'How does this help our reporting?',
        answer:
          'Leadership leaves with a board reporting template and a clearer sense of which questions to ask. That tends to improve the quality of what the security team is asked for, not just what the board receives.',
      },
    ],
    cta: {
      title: 'Ready to brief your leadership properly?',
      description: 'Talk to Difaac about a masterclass scoped to your board and sector.',
    },
  },

  'all-programs': {
    hero: {
      badge: 'Training Catalogue',
      badgeIcon: 'BookOpen',
      headlineLead: 'Every programme ',
      headlineAccent: 'Difaac offers',
      description:
        'The full training catalogue, from foundational analyst skills through to advanced adversary tradecraft and executive decision-making.',
    },
    facts: [
      { icon: 'BookOpen', label: 'Catalogue', value: 'Foundational to advanced' },
      { icon: 'Terminal', label: 'Delivery', value: 'Hands-on labs' },
      { icon: 'Users', label: 'Audiences', value: 'Analysts to boards' },
      { icon: 'Award', label: 'Assessment', value: 'Practical' },
    ],
    overview: {
      title: 'One catalogue, built as a progression',
      body: 'Programmes are designed to build on each other rather than stand alone. A team can start at foundational analyst capability and progress through hunting, response, and forensics, while leadership follows a separate track built for the decisions they own. Every programme is taught by practitioners and assessed practically.',
      scope: [
        { title: 'Foundational', description: 'Core analyst skills, security fundamentals, and tooling literacy.' },
        { title: 'Operational', description: 'Threat hunting, incident response, and detection engineering.' },
        { title: 'Advanced', description: 'Forensics, malware analysis, and offensive tradecraft for defenders.' },
        { title: 'Leadership', description: 'Executive masterclasses and board-level risk decision-making.' },
      ],
    },
    phases: {
      heading: 'How to choose a programme',
      description: 'Assessment first, so people land at the right level.',
      items: [
        { title: 'Capability review', description: 'Establishing where your team is today and which gaps matter most.', duration: 'Step 1' },
        { title: 'Pathway design', description: 'Mapping a progression across programmes rather than booking isolated courses.', duration: 'Step 2' },
        { title: 'Scheduling', description: 'Sequencing delivery around operational commitments and rotas.', duration: 'Step 3' },
        { title: 'Delivery', description: 'Programmes delivered on site or remotely with cloud-hosted labs.', duration: 'Step 4' },
        { title: 'Progression review', description: 'Reassessing capability and planning the next stage of the pathway.', duration: 'Step 5' },
      ],
    },
    deliverables: {
      heading: 'What a pathway includes',
      description: 'Structured progression rather than one-off courses.',
      items: [
        { icon: 'ClipboardCheck', title: 'Capability assessment', description: 'Where your team sits today, measured practically.' },
        { icon: 'BookOpen', title: 'Training pathway', description: 'A sequenced plan across programmes and levels.' },
        { icon: 'Terminal', title: 'Lab access', description: 'Retained environments for practice between programmes.' },
        { icon: 'Award', title: 'Assessment records', description: 'Practical evaluation results for each attendee.' },
        { icon: 'BarChart3', title: 'Progression tracking', description: 'Capability measured over time, not just attendance logged.' },
        { icon: 'GraduationCap', title: 'Certificates', description: 'Completion records for professional development requirements.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'Users', title: 'Teams planning development', description: 'Build a structured pathway rather than booking ad hoc courses.' },
        { icon: 'TrendingUp', title: 'Growing security functions', description: 'Bring new hires to operational capability on a predictable timeline.' },
        { icon: 'Landmark', title: 'Organisations with mixed audiences', description: 'Cover analysts, responders, and leadership under one plan.' },
      ],
    },
    faqs: [
      {
        question: 'How do we know which programme to start with?',
        answer:
          'A capability review before booking establishes where the team actually sits. That prevents the common failure of putting people into advanced material too early or paying for content they already know.',
      },
      {
        question: 'Can we combine programmes into a pathway?',
        answer:
          'Yes, and that is how most teams use the catalogue. Programmes are designed to build on each other, so a sequenced pathway delivers considerably more than the same courses booked in isolation.',
      },
      {
        question: 'Do you cover both technical and leadership audiences?',
        answer:
          'Yes. Technical tracks run from foundational analyst skills through forensics and offensive tradecraft, and a separate leadership track covers board and executive decision-making.',
      },
      {
        question: 'Is delivery on site or remote?',
        answer:
          'Both are available across the catalogue. Labs are cloud-hosted either way, so the hands-on component is the same regardless of delivery mode.',
      },
      {
        question: 'How is progress measured?',
        answer:
          'Through practical assessment rather than attendance. Each programme evaluates what attendees can do, and progression is tracked across the pathway so capability growth is visible.',
      },
    ],
    cta: {
      title: 'Ready to plan a training pathway?',
      description: 'Talk to Difaac about a capability review and a programme pathway for your team.',
    },
  },

  'cyber-investigation': {
    hero: {
      badge: 'Cyber Investigation',
      badgeIcon: 'Search',
      headlineLead: 'Trace attacks ',
      headlineAccent: 'back to their source',
      description:
        'Attribution-focused investigation drawing on global threat actor intelligence to establish who targeted you and why.',
    },
    facts: [
      { icon: 'Clock', label: 'Typical duration', value: '3 to 8 weeks' },
      { icon: 'Radar', label: 'Informed by', value: 'Actor intelligence' },
      { icon: 'Crosshair', label: 'Focus', value: 'Attribution' },
      { icon: 'Handshake', label: 'Coordination', value: 'Law enforcement' },
    ],
    overview: {
      title: 'Who did this, and will they come back',
      body: 'Containing an incident answers what happened. Investigation answers who was behind it and what they wanted, which is what determines whether you are facing a one-off or a persistent adversary. Findings draw on Difaac actor tracking and can support law enforcement referral where you choose to pursue it.',
      scope: [
        { title: 'Infrastructure tracing', description: 'Mapping attacker infrastructure and its links to known operations.' },
        { title: 'Tradecraft analysis', description: 'Comparing observed technique against tracked actor behaviour.' },
        { title: 'Financial tracing', description: 'Following cryptocurrency and payment flows where they are in scope.' },
        { title: 'Actor profiling', description: 'Establishing capability, motivation, and likelihood of return.' },
      ],
    },
    phases: {
      heading: 'How an investigation runs',
      description: 'From evidence to attribution, with confidence stated honestly.',
      items: [
        { title: 'Evidence review', description: 'Consolidating incident evidence and identifying viable investigative leads.', duration: 'Week 1' },
        { title: 'Infrastructure analysis', description: 'Tracing attacker infrastructure and correlating it with tracked operations.', duration: 'Week 2-3' },
        { title: 'Intelligence correlation', description: 'Matching observed tradecraft against Difaac actor and campaign data.', duration: 'Week 3-5' },
        { title: 'Attribution assessment', description: 'Forming a conclusion with an explicit confidence level and reasoning.', duration: 'Week 5-6' },
        { title: 'Referral support', description: 'Preparing material for law enforcement referral where you choose to pursue it.', duration: 'Final weeks' },
      ],
    },
    deliverables: {
      heading: 'What you receive',
      description: 'An attribution you can rely on, with its limits stated.',
      items: [
        { icon: 'Radar', title: 'Attribution assessment', description: 'Who was behind the activity, with an explicit confidence level.' },
        { icon: 'Link2', title: 'Infrastructure mapping', description: 'Attacker infrastructure and its links to known operations.' },
        { icon: 'Target', title: 'Actor profile', description: 'Capability, motivation, and typical targeting of the actor identified.' },
        { icon: 'AlertCircle', title: 'Recurrence assessment', description: 'Likelihood of the same actor returning, and what they would target.' },
        { icon: 'FileCheck2', title: 'Referral package', description: 'Evidence prepared for law enforcement referral if you pursue it.' },
        { icon: 'ShieldCheck', title: 'Defensive recommendations', description: 'Controls prioritised against this specific actor tradecraft.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'AlertTriangle', title: 'Targeted organisations', description: 'Where the attack looks deliberate rather than opportunistic.' },
        { icon: 'Scale', title: 'Teams pursuing legal action', description: 'Attribution evidence to support referral or civil proceedings.' },
        { icon: 'Radar', title: 'Repeat targets', description: 'Establish whether repeated incidents share a single adversary.' },
      ],
    },
    faqs: [
      {
        question: 'Can you always identify who was responsible?',
        answer:
          'No, and any provider claiming otherwise is overselling. Attribution depends on the evidence available and how disciplined the actor was. Conclusions are always stated with an explicit confidence level and the reasoning behind them, so you can judge how much weight to place on them.',
      },
      {
        question: 'How is this different from digital forensics?',
        answer:
          'Forensics establishes what happened inside your environment. Investigation looks outward at the infrastructure, tradecraft, and intelligence linkage to establish who was behind it. They complement each other, and forensic evidence is usually the starting point for investigation.',
      },
      {
        question: 'Do you work with law enforcement?',
        answer:
          'Where you choose to refer a matter, evidence is prepared to support that referral and the team coordinates with the relevant authorities. Whether to refer is entirely your decision.',
      },
      {
        question: 'Can you trace cryptocurrency payments?',
        answer:
          'Where cryptocurrency is in scope, blockchain tracing follows the flow of funds. How far that leads depends on the actor operational security and whether funds pass through services that respond to legal process.',
      },
      {
        question: 'Why does attribution matter to us practically?',
        answer:
          'It tells you whether you face an opportunistic attacker or a persistent adversary who will return. That distinction changes what you invest in defensively, and knowing an actor tradecraft lets you prioritise controls against how they specifically operate.',
      },
    ],
    cta: {
      title: 'Need to know who targeted you?',
      description: 'Talk to a Difaac investigator about evidence, scope, and objectives for an investigation.',
    },
  },

  'investigation-subscription': {
    hero: {
      badge: 'Investigation Subscription',
      badgeIcon: 'FileSignature',
      headlineLead: 'Investigative support ',
      headlineAccent: 'on demand',
      description:
        'Subscription access to Difaac investigators across the year, so investigative capacity is already contracted when you need it.',
    },
    facts: [
      { icon: 'Clock', label: 'Term', value: 'Annual' },
      { icon: 'Users', label: 'Access', value: 'Named investigators' },
      { icon: 'Zap', label: 'Engagement', value: 'No procurement delay' },
      { icon: 'BarChart3', label: 'Model', value: 'Drawdown hours' },
    ],
    overview: {
      title: 'The delay is usually procurement, not availability',
      body: 'Most organisations do not need a full-time investigation function, but when something surfaces the contracting cycle costs days. A subscription puts terms, contacts, and escalation paths in place ahead of time, with a pool of hours drawn down as matters arise across the year.',
      scope: [
        { title: 'Incident investigation', description: 'Investigative support on incidents as they occur through the year.' },
        { title: 'Threat research', description: 'Research requests on actors, campaigns, or threats relevant to you.' },
        { title: 'Insider matters', description: 'Discreet investigation of internal policy breach and data misuse.' },
        { title: 'Due diligence', description: 'Investigative support for acquisitions, partners, and third parties.' },
      ],
    },
    phases: {
      heading: 'How a subscription works',
      description: 'Set up once, then engage without contracting each time.',
      items: [
        { title: 'Onboarding', description: 'Terms, escalation contacts, and access agreed, with familiarisation of your environment.', duration: 'Setup' },
        { title: 'Request', description: 'A matter is raised through the agreed channel with named investigators already assigned.', duration: 'Any time' },
        { title: 'Scoping', description: 'Rapid scoping call to agree objectives and the hours the matter will draw down.', duration: 'Within 24h' },
        { title: 'Investigation', description: 'Work proceeds under the existing agreement with no separate procurement cycle.', duration: 'As scoped' },
        { title: 'Review', description: 'Periodic review of matters handled, hours used, and emerging patterns.', duration: 'Quarterly' },
      ],
    },
    deliverables: {
      heading: 'What the subscription includes',
      description: 'Standing capacity and the relationship that makes it fast.',
      items: [
        { icon: 'Users', title: 'Named investigators', description: 'A consistent team that already knows your environment.' },
        { icon: 'Zap', title: 'Pre-agreed terms', description: 'No contracting cycle between raising a matter and work starting.' },
        { icon: 'BarChart3', title: 'Drawdown hours', description: 'A pool of investigative hours used flexibly across the year.' },
        { icon: 'FileText', title: 'Matter reports', description: 'Written findings for each matter investigated.' },
        { icon: 'Radar', title: 'Priority research', description: 'Threat research requests on actors and campaigns relevant to you.' },
        { icon: 'Presentation', title: 'Quarterly review', description: 'Patterns across matters handled, and what they suggest.' },
      ],
    },
    audience: {
      heading: 'Who this is for',
      items: [
        { icon: 'TrendingUp', title: 'Teams with recurring matters', description: 'Several investigations a year without needing a permanent function.' },
        { icon: 'Zap', title: 'Teams that cannot wait on procurement', description: 'Where a contracting cycle would cost days you do not have.' },
        { icon: 'Landmark', title: 'Regulated organisations', description: 'Demonstrate standing investigative capability to regulators.' },
      ],
    },
    faqs: [
      {
        question: 'What happens to unused hours?',
        answer:
          'Terms are agreed at onboarding, including how unused hours are treated at the end of the term. That is set out explicitly in the agreement rather than left ambiguous.',
      },
      {
        question: 'Can we exceed the subscribed hours?',
        answer:
          'Yes. A significant matter can extend beyond the pool, and additional hours are added under the same pre-agreed terms, so there is still no procurement cycle to work through.',
      },
      {
        question: 'Do we get the same investigators each time?',
        answer:
          'Yes. Named investigators are assigned at onboarding and retain familiarity with your environment, which meaningfully shortens scoping on each new matter.',
      },
      {
        question: 'How is this different from an incident response retainer?',
        answer:
          'An IR retainer is for active incidents requiring containment. An investigation subscription covers the broader investigative work that is not an emergency: insider matters, threat research, due diligence, and attribution. Many organisations hold both.',
      },
      {
        question: 'How quickly can a matter be picked up?',
        answer:
          'A scoping call typically happens within 24 hours of raising a matter. Because terms are already in place and the investigators know your environment, work begins immediately after scoping.',
      },
    ],
    cta: {
      title: 'Ready to put investigative capacity in place?',
      description: 'Talk to Difaac about subscription terms and onboarding for your organisation.',
    },
  },
}

export function getServicePage(slug: string | undefined): ServicePageContent | undefined {
  return slug ? servicePages[slug] : undefined
}
