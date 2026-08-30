export type Industry = {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
}

export const industries: Industry[] = [
  { slug: 'financial-services', name: 'Financial Services', icon: 'Landmark', tagline: 'Defend transactions and accounts at scale.', description: 'Banks and payment providers rely on Difaac to stop account takeover, payment fraud, and targeted intrusion attempts.' },
  { slug: 'government', name: 'Government', icon: 'Building2', tagline: 'Protect critical public infrastructure.', description: 'National agencies use Difaac intelligence to track state-sponsored activity and defend citizen-facing systems.' },
  { slug: 'telecom', name: 'Telecom', icon: 'Radio', tagline: 'Secure networks that everything else depends on.', description: 'Telecom operators use Difaac to monitor for SIM-swap fraud, network intrusion, and subscriber data exposure.' },
  { slug: 'retail-ecommerce', name: 'Retail & eCommerce', icon: 'ShoppingCart', tagline: 'Stop fraud without slowing down checkout.', description: 'Retailers use Difaac to detect account takeover, promo abuse, and card testing without adding friction.' },
  { slug: 'crypto', name: 'Crypto', icon: 'Coins', tagline: 'Track threats unique to digital assets.', description: 'Exchanges and custodians rely on Difaac to monitor wallet-draining schemes, phishing kits, and exchange impersonation.' },
  { slug: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', tagline: 'Protect patient data and clinical systems.', description: 'Healthcare providers use Difaac to defend against ransomware and safeguard connected medical devices.' },
]

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug)
}
