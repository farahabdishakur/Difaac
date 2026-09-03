/**
 * Homepage product showcase copy.
 *
 * The homepage gives each product one full-width band: a headline, a short
 * paragraph, and a look at the console. That needs shorter, blunter wording
 * than either the nav tagline (a few words) or the product page's own hero
 * (several sentences), so it is written once here rather than derived from
 * either.
 *
 * The wording is Difaac's own and describes what this platform actually does.
 * Where a band shows a screenshot, it is a real capture of the workspace at
 * the path named in `screenshot.path` — products whose workspace section is
 * not built yet carry no screenshot rather than a mocked one.
 */

export type ShowcaseEntry = {
  slug: string
  headline: string
  description: string
  screenshot?: { image: string; path: string }
}

export const showcase: ShowcaseEntry[] = [
  {
    slug: 'threat-intelligence',
    headline: 'Know who is coming for you',
    description:
      'Difaac tracks the groups active against your sector, the infrastructure they stand up, and the methods they reuse between campaigns. Your defences get tuned to adversaries that are actually operating, not to a generic rule set.',
    screenshot: {
      image: '/screenshots/workspace-threat-intelligence.png',
      path: '/workspace/threat-intelligence',
    },
  },
  {
    slug: 'fraud-protection',
    headline: 'Stop fraud without punishing real customers',
    description:
      'Every session is scored as it happens on device, behaviour, and network signals. Genuine customers move through login and checkout untouched; scripted traffic and stolen credentials are stopped at the point they are used.',
    screenshot: {
      image: '/screenshots/workspace-fraud.png',
      path: '/workspace/fraud',
    },
  },
  {
    slug: 'managed-xdr',
    headline: 'Catch the attack while it is still running',
    description:
      'Signals from endpoints, network, email, and cloud land in one timeline instead of four consoles. Analysts who know your environment triage what fires, confirm what is real, and contain it under playbooks you approved in advance.',
    screenshot: {
      image: '/screenshots/workspace-managed-xdr.png',
      path: '/workspace/managed-xdr',
    },
  },
  {
    slug: 'attack-surface-management',
    headline: 'See everything you have left exposed',
    description:
      'Difaac maps the domains, hosts, and services that carry your name — including the ones nobody remembers deploying — and ranks what it finds by what an attacker could realistically reach, not by severity score alone.',
    screenshot: {
      image: '/screenshots/workspace-attack-surface.png',
      path: '/workspace/attack-surface',
    },
  },
  {
    slug: 'digital-risk-protection',
    headline: 'Defend your name beyond your own network',
    description:
      'Impersonation, lookalike domains, leaked credentials, and counterfeit listings are found across the open, deep, and dark web. Findings come with takedown action behind them, not just a notification.',
    screenshot: {
      image: '/screenshots/workspace-digital-risk.png',
      path: '/workspace/digital-risk',
    },
  },
  {
    slug: 'business-email-protection',
    headline: 'Keep the inbox from being the way in',
    description:
      'Attachments and links are detonated in isolation before they reach a mailbox, and the attempts that carry no payload at all — invoice fraud, executive impersonation — are caught on language and context instead.',
    screenshot: {
      image: '/screenshots/workspace-email-protection.png',
      path: '/workspace/email-protection',
    },
  },
]
