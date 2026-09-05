/**
 * Product FAQs.
 *
 * Kept apart from the rest of the product copy because it is the one block a
 * buyer reads to decide whether to talk to us, and it has to answer the real
 * questions honestly. Every answer here follows from how the product actually
 * works (see `product-content.ts`) — none of it invents a capability, a
 * certification, or a number the platform does not have.
 */

export type Faq = { question: string; answer: string }

export const productFaqs: Record<string, Faq[]> = {
  'threat-intelligence': [
    {
      question: 'How does the intelligence reach our team?',
      answer:
        'Through the channels you already use — STIX/TAXII or REST for platforms and automation, or indicators routed straight into your SIEM or SOAR. Nothing here asks you to work in a separate console you would otherwise ignore.',
    },
    {
      question: 'Can collection be scoped to our sector and region?',
      answer:
        'Yes. Rather than handing you the whole global feed, collection can be narrowed to the actors and campaigns that operate against your industry and geography, so analysts spend their time on intelligence that is relevant to you.',
    },
    {
      question: 'Do we have to replace our existing threat feeds?',
      answer:
        'No. This is delivered over standards, so it sits alongside what you already run and enriches it. Replacing a working pipeline is a cost to you, not a requirement from us.',
    },
    {
      question: 'What does an analyst get that a raw feed does not give?',
      answer:
        'Indicators arrive pre-scored and attributed to known actors, with the reasoning behind the attribution and its confidence stated. That context is what lets a triage team close false positives quickly and escalate the real thing.',
    },
  ],

  'fraud-protection': [
    {
      question: 'Will this add friction for legitimate customers?',
      answer:
        'No — that is the point of scoring every session. Only the sessions that carry genuine risk are challenged; everyone else reaches login or checkout uninterrupted.',
    },
    {
      question: 'How is it integrated into our flows?',
      answer:
        'A lightweight SDK on web and mobile collects the signals, and a decision API returns a risk score inline with your authentication and payment flows. Your own policies decide whether to allow, challenge, or block.',
    },
    {
      question: 'What data leaves our environment?',
      answer:
        'Device and behavioural signals needed to tell a human from automation and a returning device from a new one — not the contents of a transaction. What is collected and how long it is kept is set in the contract, not assumed.',
    },
    {
      question: 'Can our fraud team investigate on their own?',
      answer:
        'Yes. Analysts get a case workspace with full session replay, so a flagged session can be reviewed and a decision justified rather than taken on trust.',
    },
  ],

  'managed-xdr': [
    {
      question: 'Do we need to replace our EDR or SIEM?',
      answer:
        'No. Connectors ingest telemetry from the endpoint, network, and cloud tooling you already run and correlate it into one timeline. The value is in the correlation and the analysts, not in ripping out what works.',
    },
    {
      question: 'Who takes containment actions, and how?',
      answer:
        'Our analysts do, against playbooks scoped and approved with your team before any incident — with an approval step wherever you require one. Nothing is isolated or cut off on a whim.',
    },
    {
      question: 'What is the response time on a critical incident?',
      answer:
        'Under fifteen minutes to first response on incidents classified as critical. That is a commitment about the service you receive, staffed around the clock including weekends and holidays.',
    },
    {
      question: 'How are we told when something happens?',
      answer:
        'Escalations are routed into the ticketing and chat systems you already work in, so an alert that matters reaches the right person where they already are.',
    },
  ],

  'attack-surface-management': [
    {
      question: 'Do we have to install agents on the assets you find?',
      answer:
        'No. Discovery and scanning run from the outside, the way an attacker sees you, so there is nothing to deploy on assets you may not even know you own yet.',
    },
    {
      question: 'How are findings prioritised?',
      answer:
        'By real-world exploitability and business impact, not by a raw severity score. A critical-rated issue nobody can reach ranks below a lesser one that is genuinely exposed.',
    },
    {
      question: 'How do findings reach the people who fix them?',
      answer:
        'They are pushed into the ticketing workflow your remediation team already uses, and tracked until they are closed rather than left in a report.',
    },
    {
      question: 'How often is our perimeter checked?',
      answer:
        'Continuously. New and changed assets are surfaced as they appear, so an acquisition or a forgotten subdomain does not sit unmonitored until the next scheduled scan.',
    },
  ],

  'digital-risk-protection': [
    {
      question: 'How quickly are phishing domains detected?',
      answer:
        'Lookalike and typosquat domains are flagged within minutes of registration — before a campaign built on them reaches your customers, which is the window that actually matters.',
    },
    {
      question: 'Who handles the takedowns?',
      answer:
        'An in-house team, working through direct relationships with registrars, hosts, and platforms. Detection without removal is only half the job, so takedown is run by us rather than handed back to you.',
    },
    {
      question: 'What sources do you monitor?',
      answer:
        'The open, deep, and dark web — domain registrations, marketplaces, social platforms, and closed channels — scoped to your brand, trademarks, and named executives during setup.',
    },
    {
      question: 'Can you protect named executives?',
      answer:
        'Yes. Monitoring covers impersonation, leaked personal data, and targeted harassment of key personnel, with alerts routed to the brand, legal, and security stakeholders who need them.',
    },
  ],

  'business-email-protection': [
    {
      question: 'Do we have to change our mail routing?',
      answer:
        'No. Integration is API-based and leaves your existing routing and MX records untouched, so there is no cutover risk and nothing to unpick if you change your mind.',
    },
    {
      question: 'How does it catch business email compromise with no payload?',
      answer:
        'By reading the context of the message — the impersonation and social-engineering signals — rather than depending on a malicious attachment or link that a payload-free attack never includes.',
    },
    {
      question: 'What happens to attachments and links?',
      answer:
        'Suspicious attachments and embedded links are detonated in an isolated environment before they reach a mailbox, which exposes behaviour that static scanning and reputation checks miss.',
    },
    {
      question: 'Can it re-examine mail that was already delivered?',
      answer:
        'Yes. Delivered mail is continuously re-scanned as new intelligence emerges, so a message that looked clean on arrival can be pulled back from inboxes once it is understood.',
    },
  ],
}

export function getProductFaqs(slug: string | undefined): Faq[] {
  return slug ? (productFaqs[slug] ?? []) : []
}
