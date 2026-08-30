export type Testimonial = {
  quote: string
  name: string
  title: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Difaac found assets we had forgotten we owned. Attack Surface Management gave us a live map of exposure instead of a quarterly spreadsheet.',
    name: 'Elena Marsh',
    title: 'CISO',
    company: 'Northbridge Financial',
  },
  {
    quote:
      'Device fingerprinting cut account takeover attempts by more than half in the first quarter. Our fraud team finally trusts the signal.',
    name: 'Rui Tanaka',
    title: 'Head of Fraud',
    company: 'Kestrel Pay',
  },
  {
    quote:
      'The analysts behind Managed XDR feel like an extension of our own team. They catch things our old tooling never surfaced.',
    name: 'Amara Osei',
    title: 'SOC Manager',
    company: 'Vantage Energy',
  },
]

export const analystBadges = ['Gartner', 'Forrester', 'IDC', 'MITRE ATT&CK', 'Cybersecurity Excellence Awards']

export const partnerAgencies = ['INTERPOL', 'EUROPOL', 'AFRIPOL']

export const globalOperations = [
  { name: 'Operation Distanthill', description: 'Coordinated takedown of a ransomware affiliate network across three continents.' },
  { name: 'Operation Kaerb', description: 'Disruption of a phishing-as-a-service platform used against financial institutions.' },
  { name: 'Operation GoldDragon', description: 'Joint investigation into a state-linked group targeting critical infrastructure.' },
]

export const stats = [
  { value: '1,550+', label: 'Successful investigations' },
  { value: '$1B+', label: 'Real losses prevented' },
  { value: '#1', label: 'Incident Response retainer vendor' },
  { value: '24/7', label: 'Global SOC coverage' },
]

export const awardBadges = [
  { label: 'Threat Intelligence Leader', icon: 'Award' },
  { label: 'Best Support', icon: 'HeartHandshake' },
  { label: 'Easiest Setup', icon: 'Zap' },
  { label: 'Highest User Adoption', icon: 'TrendingUp' },
  { label: 'Best Relationship', icon: 'Handshake' },
  { label: 'Most Implementable', icon: 'CheckCircle2' },
]
