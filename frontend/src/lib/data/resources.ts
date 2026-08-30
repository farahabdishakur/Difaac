export type Resource = {
  slug: string
  title: string
  type: 'Trend Report' | 'White Paper' | 'Threat Research' | 'Guide'
  excerpt: string
  isNew: boolean
}

export const resources: Resource[] = [
  {
    slug: 'high-tech-crime-trends-2026',
    title: 'High-Tech Crime Trends 2026',
    type: 'Trend Report',
    excerpt: 'A year of threat actor activity, distilled into the trends shaping 2026 security budgets.',
    isNew: true,
  },
  {
    slug: 'ransomware-negotiation-playbook',
    title: 'The ransomware negotiation playbook',
    type: 'White Paper',
    excerpt: 'What to do in the first 24 hours after a ransomware notice appears.',
    isNew: true,
  },
  {
    slug: 'inside-a-phishing-kit-marketplace',
    title: 'Inside a phishing-kit marketplace',
    type: 'Threat Research',
    excerpt: 'How off-the-shelf phishing kits are bought, sold, and updated in closed forums.',
    isNew: false,
  },
  {
    slug: 'building-a-cti-program-guide',
    title: 'Building a threat intelligence program',
    type: 'Guide',
    excerpt: 'A practical framework for standing up CTI capability without a dedicated headcount.',
    isNew: false,
  },
  {
    slug: 'attack-surface-blind-spots',
    title: 'The blind spots in your attack surface',
    type: 'Threat Research',
    excerpt: 'Why shadow IT and forgotten subdomains remain the most common entry point.',
    isNew: false,
  },
  {
    slug: 'fraud-rings-anatomy',
    title: 'The anatomy of a fraud ring',
    type: 'White Paper',
    excerpt: 'How coordinated fraud networks organize, recruit, and cash out.',
    isNew: false,
  },
]

export function getResourceBySlug(slug: string) {
  return resources.find((r) => r.slug === slug)
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
}

export const blogPosts: BlogPost[] = [
  { slug: 'why-attack-surface-drifts', title: 'Why your attack surface drifts every quarter', excerpt: 'Asset sprawl is not a one-time cleanup problem. It is continuous.', date: '2026-06-02', category: 'Attack Surface' },
  { slug: 'bec-without-a-payload', title: 'Business email compromise without a payload', excerpt: 'The most costly email attacks contain no malware at all.', date: '2026-05-18', category: 'Email Security' },
  { slug: 'reading-a-ransomware-note', title: 'What a ransomware note tells you about the actor', excerpt: 'Naming conventions and negotiation tone often reveal the group behind an attack.', date: '2026-04-29', category: 'Threat Intelligence' },
  { slug: 'fraud-teams-need-cti', title: 'Fraud teams need threat intelligence too', excerpt: 'The line between fraud and cybercrime keeps disappearing.', date: '2026-04-11', category: 'Fraud' },
]
