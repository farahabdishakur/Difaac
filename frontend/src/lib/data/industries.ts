export type Industry = {
  slug: string
  name: string
  tagline: string
  description: string
  icon: string
}

export const industries: Industry[] = [
  { slug: 'financial-services', name: 'Financial Services', icon: 'Landmark', tagline: 'Trusted by leading banks and payment processors worldwide.', description: 'Difaac delivers real-time fraud detection, threat intelligence, and managed XDR to protect financial institutions against account takeover, payment fraud, and advanced persistent threats.' },
  { slug: 'government', name: 'Government', icon: 'Building2', tagline: 'Securing critical infrastructure at the national level.', description: 'Government agencies leverage Difaac\'s intelligence platform to detect state-sponsored threats, protect sensitive citizen data, and maintain resilient public-sector infrastructure.' },
  { slug: 'telecom', name: 'Telecom', icon: 'Radio', tagline: 'Protecting the networks that power global connectivity.', description: 'Telecom operators deploy Difaac to combat SIM-swap fraud, detect network intrusions in real time, and safeguard subscriber data across distributed infrastructure.' },
  { slug: 'retail-ecommerce', name: 'Retail & eCommerce', icon: 'ShoppingCart', tagline: 'Frictionless security across the entire commerce lifecycle.', description: 'Difaac enables retailers to detect account takeover, payment card fraud, and promotional abuse at checkout — without compromising customer experience or conversion rates.' },
  { slug: 'crypto', name: 'Crypto', icon: 'Coins', tagline: 'Purpose-built defense for the digital asset ecosystem.', description: 'Exchanges and custodians rely on Difaac to detect wallet compromise, dismantle phishing infrastructure, and monitor blockchain-based fraud in real time.' },
  { slug: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', tagline: 'Defending patient care from ransomware and data breaches.', description: 'Difaac protects healthcare organizations from ransomware, secures connected medical devices, and ensures compliance with patient data protection requirements.' },
]

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug)
}
