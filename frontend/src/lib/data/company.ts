/**
 * Content for the company pages.
 *
 * A note on what is deliberately absent.
 *
 * Comparable pages lead with historical figures — headcount, investigations
 * closed, money recovered, years in operation. Those are claims about a
 * company's past, and inventing them would put false statements in front of
 * buyers who are evaluating a security vendor. Nothing here asserts a history
 * Difaac has not had.
 *
 * What the page states instead is how the platform works and what it commits
 * to, which is true from day one. Entries marked `needsRealData` are the ones
 * only the business can supply; they are listed here rather than filled with
 * plausible-looking numbers.
 */

export type Principle = {
  icon: string
  title: string
  description: string
}

export type Capability = {
  icon: string
  title: string
  description: string
}

export type Commitment = {
  value: string
  label: string
  detail: string
}

/** What the company is for. */
export const mission = {
  headline: 'Intelligence-driven defence, built for the teams that hold the line.',
  body:
    'Difaac exists because most organisations face adversaries they cannot see. We build the platform and the analyst practice that turn scattered signals into a picture a security team can act on — actor attribution, live detection, and response support, delivered as one system rather than six disconnected tools.',
}

/**
 * How the company works.
 *
 * Written as commitments rather than achievements, because a commitment is
 * verifiable against the service a customer actually receives.
 */
export const principles: Principle[] = [
  {
    icon: 'Search',
    title: 'Evidence over assertion',
    description:
      'Every finding we report carries the evidence behind it — reproduction steps, forensic artefacts, or the reasoning behind an attribution, with its confidence stated plainly. If the evidence does not support a conclusion, we say so rather than rounding up.',
  },
  {
    icon: 'Users',
    title: 'Analysts, not just automation',
    description:
      'Automated collection finds volume; people find meaning. Detections are validated by an analyst before they reach a customer, so what arrives is an escalation worth acting on rather than a queue to triage.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Defensive by default',
    description:
      'We work only in defence of the organisations that engage us. Testing runs inside agreed rules of engagement, with written scope and escalation paths settled before any work begins.',
  },
  {
    icon: 'Lock',
    title: 'Customer data stays the customer’s',
    description:
      'Telemetry a customer shares is used to defend that customer. It is not resold, and it is not repackaged as a product. Retention and deletion terms are agreed in the contract, not assumed.',
  },
  {
    icon: 'Link2',
    title: 'Fits the stack you already run',
    description:
      'Intelligence reaches your SIEM and SOAR through standard interfaces. Replacing a working detection pipeline is a cost to you and a lock-in for us, so we integrate instead.',
  },
  {
    icon: 'FileCheck2',
    title: 'Clear about limits',
    description:
      'Coverage has boundaries, and a report that hides them is worse than one that names them. Scope and what falls outside it are stated in writing, on every engagement.',
  },
]

/** What the company actually does, in plain terms. */
export const capabilities: Capability[] = [
  {
    icon: 'Radar',
    title: 'Threat intelligence',
    description:
      'Continuous collection across closed forums, marketplaces, malware, and infrastructure, attributed to tracked actors and delivered pre-scored.',
  },
  {
    icon: 'Activity',
    title: 'Detection and response',
    description:
      'Round-the-clock monitoring across endpoint, network, email, and cloud, with containment run against playbooks agreed in advance.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Fraud prevention',
    description:
      'Device fingerprinting and behavioural analysis that stop account takeover and payment fraud without adding friction for legitimate customers.',
  },
  {
    icon: 'Fingerprint',
    title: 'Digital risk protection',
    description:
      'Detection and takedown of phishing, impersonation, and brand abuse across the open, deep, and dark web.',
  },
  {
    icon: 'Terminal',
    title: 'Offensive testing',
    description:
      'Penetration testing, red teaming, and adversary simulation run by senior operators, reported with evidence you can act on.',
  },
  {
    icon: 'Siren',
    title: 'Incident response',
    description:
      'On-demand response to contain an active incident, establish scope, and preserve evidence to a standard that survives scrutiny.',
  },
]

/**
 * Service commitments.
 *
 * These describe how the platform is operated, which is true on the first day
 * of a contract. None of them is a claim about volume delivered historically.
 */
export const commitments: Commitment[] = [
  {
    value: '24/7',
    label: 'Analyst coverage',
    detail: 'Monitoring and escalation staffed continuously, including weekends and holidays.',
  },
  {
    value: 'Under 15 min',
    label: 'Critical response',
    detail: 'Time to first response on incidents classified as critical.',
  },
  {
    value: 'Human-validated',
    label: 'Every escalation',
    detail: 'No detection reaches a customer without an analyst confirming it first.',
  },
  {
    value: 'Standards-based',
    label: 'Integration',
    detail: 'STIX/TAXII and REST delivery into the tooling you already run.',
  },
]

/**
 * Sections the business must fill with its own facts.
 *
 * Rendered as an explicit invitation to get in touch rather than as invented
 * detail. A named leadership team, office list, and certification register are
 * exactly the things a security buyer checks, and getting caught inventing one
 * costs more than not having it yet.
 */
export const needsRealData = [
  'Leadership team and named executives',
  'Office locations and legal entities',
  'ISO 27001 / SOC 2 certification status',
  'Industry memberships (FIRST, Trusted Introducer, sector ISACs)',
  'Customer references and case studies',
]
