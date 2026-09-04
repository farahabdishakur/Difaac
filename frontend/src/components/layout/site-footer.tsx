import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/layout/logo-mark'

const columns = [
  {
    title: 'Products',
    links: [
      { label: 'Threat Intelligence', href: '/products/threat-intelligence' },
      { label: 'Digital Risk Protection', href: '/products/digital-risk-protection' },
      { label: 'Managed XDR', href: '/products/managed-xdr' },
      { label: 'Fraud Protection', href: '/products/fraud-protection' },
      { label: 'Attack Surface Management', href: '/products/attack-surface-management' },
      { label: 'Pricing', href: '/subscriptions/managed-xdr' },
      { label: 'All products', href: '/products' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Incident Response', href: '/services/incident-response' },
      { label: 'Penetration Testing', href: '/services/penetration-testing' },
      { label: 'Security Audit', href: '/services/security-audit' },
      { label: 'Training & Education', href: '/services/training' },
      { label: 'All services', href: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/company' },
      { label: 'Careers', href: '/careers' },
      { label: 'Team', href: '/company#team' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Research reports', href: '/resources' },
      { label: 'Webinars', href: '/resources?type=webinar' },
      { label: 'Threat glossary', href: '/resources?type=glossary' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-ink-2 overflow-hidden">

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_2.8fr]">
          <div className="flex flex-col gap-4">
            <LogoMark />
            <p className="max-w-xs text-sm leading-relaxed text-body mt-2">
              Difaac defends organizations worldwide with intelligence-led threat detection,
              response, and digital risk protection.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              {/* X (formerly Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Difaac on X"
                className="group flex size-9 items-center justify-center rounded-lg border border-line bg-ink text-muted-2 transition-all duration-200 hover:border-brand hover:text-brand hover:scale-110 shadow-sm"
              >
                <svg className="size-4 fill-current transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Difaac on LinkedIn"
                className="group flex size-9 items-center justify-center rounded-lg border border-line bg-ink text-muted-2 transition-all duration-200 hover:border-brand hover:text-brand hover:scale-110 shadow-sm"
              >
                <svg className="size-4 fill-current transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Difaac on Discord"
                className="group flex size-9 items-center justify-center rounded-lg border border-line bg-ink text-muted-2 transition-all duration-200 hover:border-brand hover:text-brand hover:scale-110 shadow-sm"
              >
                <svg className="size-4 fill-current transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Difaac on Facebook"
                className="group flex size-9 items-center justify-center rounded-lg border border-line bg-ink text-muted-2 transition-all duration-200 hover:border-brand hover:text-brand hover:scale-110 shadow-sm"
              >
                <svg className="size-4 fill-current transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Difaac on YouTube"
                className="group flex size-9 items-center justify-center rounded-lg border border-line bg-ink text-muted-2 transition-all duration-200 hover:border-brand hover:text-brand hover:scale-110 shadow-sm"
              >
                <svg className="size-4 fill-current transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="var(--color-ink-2, #0e1217)" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">{column.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-body transition-colors hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line-soft pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-2">
            &copy; {new Date().getFullYear()} Difaac. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="text-xs text-muted-2 transition-colors hover:text-brand">
              Privacy policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-2 transition-colors hover:text-brand">
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
