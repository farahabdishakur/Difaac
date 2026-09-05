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
 * to, which is true from day one.
 *
 * Four things a security buyer will eventually ask for are deliberately absent
 * because only the business can supply them, and inventing any of them would
 * cost more than not having it yet: the legal entity registration, ISO 27001 /
 * SOC 2 certification status, industry memberships (FIRST, Trusted Introducer,
 * sector ISACs), and customer references. Add them here once they are real.
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

export type Founder = {
  name: string
  role: string
  /** Portrait path under /public. Missing files fall back to a monogram, so a
      photo can be dropped in at any time without touching code. */
  photo?: string
}

/** What the company is for. */
export const mission = {
  headline: 'Intelligence-driven defence, built for the teams that hold the line.',
  body:
    'Difaac exists because most organisations face adversaries they cannot see. We build the platform and the analyst practice that turn scattered signals into a picture a security team can act on — actor attribution, live detection, and response support, delivered as one system rather than six disconnected tools.',
}

/**
 * The founding story.
 *
 * Difaac started as a final-year project at Borama University, built by
 * three students who wanted to see whether a platform like Group-IB's could
 * be built from Somaliland. It is genuinely that recent — the honesty
 * principle at the top of this file applies here most of all: the page says
 * exactly how young the company is rather than implying otherwise.
 */
export const founding = {
  founded: 'April 2026',
  story:
    'Difaac began as the final-year project of three computer science students at Borama University — an attempt to find out whether the kind of intelligence-driven cyber defence platform Group-IB has built for global enterprises could be built for organisations in Somaliland and the wider region. It became the platform this site describes.',
}

export const founders: Founder[] = [
  { name: 'Farah', role: 'Co-Founder', photo: '/team/farah.jpg' },
  { name: 'Sharmaarke', role: 'Co-Founder', photo: '/team/sharmaarke.jpg' },
  { name: 'Khaalid', role: 'Co-Founder', photo: '/team/khaalid.jpg' },
]

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
 * Where the company is, and how to reach it.
 *
 * One office, stated as one office. The email and number are the real ones —
 * the same pair carried in the footer and the contact panel — because a
 * contact page that lists channels nobody answers is worse than one honest
 * address.
 */
export const office = {
  city: 'Awdal, Somaliland',
  detail: 'Borama, Awdal region — where Difaac was founded and is built.',
  hours: 'Saturday – Thursday · 08:00 – 18:00 EAT',
}

export type ContactChannel = {
  icon: string
  label: string
  value: string
  href: string
  note: string
}

export const contactChannels: ContactChannel[] = [
  {
    icon: 'Mail',
    label: 'Email',
    value: 'Difaacgroup@gmail.com',
    href: 'mailto:Difaacgroup@gmail.com',
    note: 'General questions, partnerships, and careers — all reach the team here.',
  },
  {
    icon: 'Phone',
    label: 'Phone',
    value: '+252 67 248 9335',
    href: 'tel:+252672489335',
    note: 'Reach a person directly during business hours.',
  },
  {
    icon: 'MapPin',
    label: 'Office',
    value: office.city,
    href: '#office',
    note: office.detail,
  },
]

/**
 * How the team is described on the Team page.
 *
 * The founders are the whole team today, and the page says so. `titleLead`
 * and the founding note carry the honesty principle at the top of this file:
 * three people, named, with no invented seniority or fabricated advisory board.
 */
export const teamNote =
  'Difaac is three people today — the founders who built it. As the platform grows so will the team, and this page will grow with it. We would rather show three real names than a page of invented titles.'

/** Partner tracks. Framed as programmes being built, not an established one. */
export type PartnerTrack = { icon: string; title: string; description: string }

export const partnerTracks: PartnerTrack[] = [
  {
    icon: 'Network',
    title: 'Managed service providers',
    description:
      'Fold Difaac intelligence and managed detection into the SOC service you already sell, so your customers get adversary context without you standing up a research team.',
  },
  {
    icon: 'Boxes',
    title: 'Technology integrators',
    description:
      'Pull indicators and enrichment into your own product over STIX/TAXII and REST. Difaac is built to sit inside a stack, not to replace one.',
  },
  {
    icon: 'Handshake',
    title: 'Channel and advisory',
    description:
      'Take Difaac to organisations you already advise, with the engagement scoped and priced in writing before either of us commits.',
  },
]

/**
 * Why someone would join. Honest about the stage: the draw is ownership and
 * early influence, not scale or perks a three-person company cannot offer.
 */
export type CareerValue = { icon: string; title: string; description: string }

export const careerValues: CareerValue[] = [
  {
    icon: 'Hammer',
    title: 'Build it, don’t maintain it',
    description:
      'Difaac is early. Whatever you touch — detection logic, the analyst workspace, the platform itself — you are shaping how it works, not fitting into a system that already exists.',
  },
  {
    icon: 'GitBranch',
    title: 'No layer between idea and ship',
    description:
      'A small team means what you build is what customers use, without an org chart in between. Ownership is direct from the first week.',
  },
  {
    icon: 'GraduationCap',
    title: 'Started by students',
    description:
      'Difaac began as a Borama University final-year project. We look for the same curiosity and follow-through that carried it from an assignment to a working platform.',
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

