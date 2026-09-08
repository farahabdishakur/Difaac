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
  slug?: string
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
  photo?: string
  note?: string
  department?: string
  linkedin?: string
  objectPosition?: string
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
 * Difaac began as a pioneering initiative at Borama University, built by
 * founders who set out to prove that an enterprise-grade, intelligence-driven
 * cyber defence platform rivaling global leaders like Group-IB could be built
 * locally for the Horn of Africa and international markets.
 */
export const founding = {
  founded: 'April 2026',
  story:
    'Difaac began as the flagship cybersecurity platform conceived and built at Borama University — an initiative to engineer a sovereign, intelligence-driven cyber defence platform capable of defending enterprises and critical infrastructure against advanced state-sponsored actors and cybercrime cartels.',
}

/**
 * The portrait file for a person, derived from their name.
 *
 * Photographs live in `public/team` named after the person they show —
 * `faarax-cabdi-shakuur-daahir.jpg` — so adding or replacing one is a matter
 * of dropping the file in, with nothing here to edit. A name with no matching
 * file falls back to a monogram, which is why a missing photo never renders as
 * a broken image.
 */
export function portraitFor(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `/team/${slug}.jpg`
}

const leadership: Omit<Founder, 'photo'>[] = [
  {
    name: 'Faarax Cabdi Shakuur Daahir',
    role: 'Chairman & Chief Executive, Co-Founder',
    department: 'Executive Leadership',
    note: 'Leads Difaac’s strategic direction, sovereign resilience work, and the relationships behind every engagement.',
    objectPosition: 'center 12%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Sharmaarke Maxamed Jaamac',
    role: 'Deputy Chief Executive & CTO, Co-Founder',
    department: 'Core Engineering & Detection',
    note: 'Stands in for the chair, and architects the detection pipeline, telemetry ingestion and correlation engines.',
    objectPosition: 'center 12%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Cabdi Fataax Abiib Muxumed',
    role: 'Chief Operating Officer, Co-Founder',
    department: 'Operations & Infrastructure',
    note: 'Runs delivery, the sensor estate, and the readiness behind every service commitment.',
    objectPosition: 'center 12%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Cabdi Waasac Xuseen Muxumed',
    role: 'Head of Threat Intelligence',
    department: 'Cyber Threat Intelligence',
    note: 'Tracks the groups operating against the region, and turns what they do into detection the platform can use.',
    objectPosition: 'center 10%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Amiin Axmed Ciiltire',
    role: 'Head of Incident Response',
    department: 'Incident Response & Forensics',
    note: 'Answers when something has already happened: containment, forensics, and getting operations back.',
    objectPosition: 'center 10%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Ubax Maxamed Cabdilaahi',
    role: 'Head of Managed XDR & SOC Operations',
    department: 'Security Operations Centre',
    note: 'Runs the monitoring, writes the containment playbooks, and goes looking for attackers instead of waiting for an alert.',
    objectPosition: 'center 15%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Khaalid Maxamed Cumer',
    role: 'Head of Fraud Protection',
    department: 'Fraud & Identity Defence',
    note: 'Works on device and behavioural signals, and on the fraud patterns that move through the region’s payment rails.',
    objectPosition: 'center 15%',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Mustafe Abubakar Khaliif',
    role: 'Head of Offensive Security',
    department: 'Offensive Security & Simulation',
    note: 'Attacks what Difaac defends: penetration testing, adversary simulation, and the findings that come back from both.',
    objectPosition: 'center 18%',
    linkedin: 'https://linkedin.com',
  },
]

/**
 * Advisory Board & Research Fellows
 *
 * Matching Group-IB's Advisory Board section, representing academic,
 * telecommunications, and sovereign cybersecurity governance leaders.
 */
const advisors: Omit<Founder, 'photo'>[] = [
  {
    name: 'Prof. Dr. Ahmed Warsame',
    role: 'Academic & R&D Advisor',
    department: 'Borama University Cyber Lab',
    note: 'Dean of Computing & Information Technology, advising on sovereign cryptographic architectures and cyber research.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Eng. Abdirahman Keyse',
    role: 'Critical Infrastructure & Telecom Security Advisor',
    department: 'Telecom Security Council',
    note: 'Senior telecommunications infrastructure architect advising on high-throughput sensor telemetry and ISP-level defense.',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Dr. Maryan Cilmi',
    role: 'Regional Cyber Governance & Policy Advisor',
    department: 'Legal & International Standards',
    note: 'Specialist in sovereign data governance, regional CERT coordination, and international compliance frameworks.',
    linkedin: 'https://linkedin.com',
  },
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

/** What the company actually does, in plain terms — the six core defence layers. */
export const capabilities: Capability[] = [
  {
    slug: 'threat-intelligence',
    icon: 'Radar',
    title: 'Threat Intelligence',
    description:
      'Continuous collection across closed forums, marketplaces, malware, and infrastructure, attributed to tracked actors and delivered pre-scored.',
  },
  {
    slug: 'managed-xdr',
    icon: 'Activity',
    title: 'Managed XDR',
    description:
      'Round-the-clock detection and response across endpoint, network, email, and cloud, with containment run against playbooks agreed in advance.',
  },
  {
    slug: 'fraud-protection',
    icon: 'ShieldCheck',
    title: 'Fraud Protection',
    description:
      'Device fingerprinting and behavioural analysis that stop account takeover and payment fraud without adding friction for legitimate customers.',
  },
  {
    slug: 'attack-surface-management',
    icon: 'Globe',
    title: 'Attack Surface Management',
    description:
      'Continuous discovery of external assets, shadow IT, and exposure risks across your entire digital footprint before adversaries exploit them.',
  },
  {
    slug: 'digital-risk-protection',
    icon: 'Fingerprint',
    title: 'Digital Risk Protection',
    description:
      'AI-driven detection and rapid takedown of phishing domains, brand impersonation, and leaked executive credentials across open and dark web.',
  },
  {
    slug: 'business-email-protection',
    icon: 'Mail',
    title: 'Business Email Protection',
    description:
      'Advanced detonation sandboxing and behavioral BEC detection that stops zero-day phishing, malware, and social engineering before the inbox.',
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
  'Meet the leadership and specialized practice leads engineering Difaac. Uniting detection engineers, threat hunters, and sovereign researchers to defend enterprise and institutional infrastructure across the region.'

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


export const founders: Founder[] = leadership.map((person) => ({
  ...person,
  photo: portraitFor(person.name),
}))

export const advisoryBoard: Founder[] = advisors.map((person) => ({
  ...person,
  photo: portraitFor(person.name),
}))

/**
 * The leadership as a reporting structure: the chair, the deputy who stands in
 * for them, and the practice leads beneath. `founders` keeps the flat list for
 * anywhere a grid is wanted; this is the same people in the order they report.
 */
export const leadershipTiers: Founder[][] = [
  founders.slice(0, 1),
  founders.slice(1, 2),
  founders.slice(2, 5),
  founders.slice(5, 8),
]
