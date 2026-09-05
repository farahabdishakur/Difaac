import { products } from '@/lib/data/products'
import { industries } from '@/lib/data/industries'
import { solutions } from '@/lib/data/solutions'
import { services } from '@/lib/data/services'

/**
 * Navigation panel content.
 *
 * Every panel is described by the same shape — a featured block on the left and
 * a set of items on the right — so the five dropdowns share one implementation
 * and cannot drift apart as entries are added.
 *
 * Item taglines and icons are read from the source data rather than restated
 * here, so a product renamed in `products.ts` is renamed in the menu too.
 */

export type MenuFeature = {
  eyebrow: string
  title: string
  description: string
  icon: string
  /** Real emblem render to use instead of the flat icon tile, when one exists. */
  image?: string
  links: { label: string; href: string }[]
}

export type MenuEntry = {
  key: string
  name: string
  tagline: string
  icon: string
  href: string
}

export type MenuPanel = {
  feature: MenuFeature
  eyebrow: string
  columns: 2 | 3
  items: MenuEntry[]
  /** Optional grouping, used where a flat list would lose meaning. */
  groups?: { title: string; items: MenuEntry[] }[]
}

export const productsMenu: MenuPanel = {
  feature: {
    eyebrow: 'Platform',
    title: 'Unified Risk Platform',
    description:
      'Every product draws on the same adversary intelligence, so a signal detected in one area strengthens detection across the rest.',
    icon: 'ShieldCheck',
    image: '/emblems/emblem_unified-risk-platform.png',
    links: [
      { label: 'Explore the platform', href: '/products' },
      { label: 'Pricing', href: '/subscriptions' },
    ],
  },
  eyebrow: 'Products',
  columns: 2,
  items: products.map((p) => ({
    key: p.slug,
    name: p.name,
    tagline: p.tagline,
    icon: p.icon,
    href: `/products/${p.slug}`,
  })),
}

export const industriesMenu: MenuPanel = {
  feature: {
    eyebrow: 'Industries',
    title: 'Defence shaped by sector',
    description:
      'The threats differ by industry, and so do the controls that matter. Each sector page sets out the risks we see and which products address them.',
    icon: 'Landmark',
    links: [{ label: 'View all industries', href: '/industries' }],
  },
  eyebrow: 'By sector',
  columns: 2,
  items: industries.map((i) => ({
    key: i.slug,
    name: i.name,
    tagline: i.tagline,
    icon: i.icon,
    href: `/industries/${i.slug}`,
  })),
}

export const solutionsMenu: MenuPanel = {
  feature: {
    eyebrow: 'Solutions',
    title: 'Start from the problem',
    description:
      'Whether you are closing a specific threat vector or equipping a role, each solution maps to the products and services that deliver it.',
    icon: 'Target',
    links: [{ label: 'View all solutions', href: '/solutions' }],
  },
  eyebrow: 'By use case',
  columns: 3,
  items: solutions
    .filter((s) => s.group === 'use-case')
    .map((s) => ({
      key: s.slug,
      name: s.name,
      tagline: s.tagline,
      icon: s.icon,
      href: `/solutions/${s.slug}`,
    })),
  groups: [
    {
      title: 'By role',
      items: solutions
        .filter((s) => s.group === 'role')
        .map((s) => ({
          key: s.slug,
          name: s.name,
          tagline: s.tagline,
          icon: s.icon,
          href: `/solutions/${s.slug}`,
        })),
    },
  ],
}

const serviceGroup = (group: string) =>
  services
    .filter((s) => s.group === group)
    .map((s) => ({
      key: s.slug,
      name: s.name,
      tagline: s.tagline,
      icon: s.icon,
      href: `/services/${s.slug}`,
    }))

export const servicesMenu: MenuPanel = {
  feature: {
    eyebrow: 'Services',
    title: 'Expert-led engagements',
    description:
      'Testing, response, investigation, and training delivered by the operators and analysts who run them, scoped in writing before any work begins.',
    icon: 'Swords',
    links: [{ label: 'View all services', href: '/services' }],
  },
  eyebrow: 'Assessment',
  columns: 3,
  items: serviceGroup('assessment'),
  groups: [
    { title: 'Response', items: serviceGroup('response') },
    { title: 'Investigation', items: serviceGroup('investigation') },
    { title: 'Training', items: serviceGroup('training') },
  ],
}

export const companyMenu: MenuPanel = {
  feature: {
    eyebrow: 'Company',
    title: 'Intelligent cyber defence',
    description:
      'How Difaac works, what we commit to, and the people building it. Every claim on the page is one a customer can hold us to.',
    icon: 'Building2',
    links: [{ label: 'About Difaac', href: '/company' }],
  },
  eyebrow: 'Company',
  columns: 2,
  items: [
    {
      key: 'about',
      name: 'About Difaac',
      tagline: 'What the platform does, and what we commit to.',
      icon: 'ShieldCheck',
      href: '/company',
    },
    {
      key: 'team',
      name: 'Team',
      tagline: 'The founders building Difaac.',
      icon: 'Users',
      href: '/company/team',
    },
    {
      key: 'careers',
      name: 'Careers',
      tagline: 'Help build the platform from the ground up.',
      icon: 'GraduationCap',
      href: '/company/careers',
    },
    {
      key: 'partners',
      name: 'Partners',
      tagline: 'Build on Difaac intelligence.',
      icon: 'Handshake',
      href: '/company/partners',
    },
    {
      key: 'contact',
      name: 'Contact',
      tagline: 'Reach the team directly.',
      icon: 'Mail',
      href: '/company/contact',
    },
  ],
}
