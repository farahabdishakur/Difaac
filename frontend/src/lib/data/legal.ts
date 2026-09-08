/**
 * The privacy policy and the terms of use.
 *
 * Written the way group-ib.com/privacy-policy writes them: plain headings that
 * say what the section is ("Cookies", "Security measures") instead of what a
 * compliance department would call it, short sentences in the first person,
 * and one real table carrying the part people actually came to read — what is
 * collected, why, and for how long.
 *
 * Every fact here is checked against the code. The table describes the columns
 * that exist in `backend/app/schemas.py`; the cookie section describes the one
 * cookie the auth routes set; the security list describes measures the
 * application actually implements. Nothing claims a certification Difaac does
 * not hold. If a claim on this page stops being true, the code changed and
 * this file has to change with it.
 */

export type LegalBlock =
  | { kind: 'text'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }

export type LegalSection = {
  id: string
  title: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  title: string
  version: string
  summary: string
  intro: LegalBlock[]
  sections: LegalSection[]
}

const CONTACT_EMAIL = 'Difaacgroup@gmail.com'
const CONTACT_PHONE = '+252 67 248 9335'
const ADDRESS = 'Borama, Awdal, Somaliland'

export const privacyPolicy: LegalDocument = {
  title: 'Privacy policy',
  version: 'September 2026',
  summary: 'What we collect, why we collect it, and how long we keep it.',
  intro: [
    {
      kind: 'text',
      text: 'This policy covers this website, the Difaac platform that people with an account sign in to, and the replies we send to anyone who writes to us.',
    },
    {
      kind: 'text',
      text: `Difaac is a cyber defence company founded in April 2026 and based in ${ADDRESS}. We decide what happens to the data described here, which makes us the controller of it. You can reach us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    },
    {
      kind: 'text',
      text: 'This page is short because there is not much to say. We are a small company, we collect little, and we would rather you read all of it than skim a longer version.',
    },
  ],
  sections: [
    {
      id: 'what-this-covers',
      title: 'What this covers',
      blocks: [
        { kind: 'text', text: 'This policy applies to:' },
        {
          kind: 'list',
          items: [
            'this website and every page on it',
            'the demo and contact forms, and our reply to anything you send through them',
            'the Difaac platform, for the people we have given an account',
          ],
        },
        {
          kind: 'text',
          text: 'It does not cover anything a customer stores inside their own systems. When we run a service for an organisation, that organisation decides what happens to its data and the contract we signed with them governs it, not this page.',
        },
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What we collect, why, and for how long',
      blocks: [
        {
          kind: 'text',
          text: 'This is the whole list. If something is not in this table, we do not have it.',
        },
        {
          kind: 'table',
          head: ['What', 'Why we have it', 'How long we keep it'],
          rows: [
            [
              'Your name, work email, company, job title, and whatever you write in the message box',
              'Because you asked us for a demo or wrote to us, and we cannot answer without it',
              'Two years after our last exchange',
            ],
            [
              'The IP address the form was sent from',
              'So one machine cannot submit the same form a thousand times',
              '90 days',
            ],
            [
              'Email address, name and role, for people with a platform account',
              'To sign you in and to decide what you are allowed to see',
              'While the account exists, then 30 days',
            ],
            [
              'Your password',
              'We never store it. We store a bcrypt hash, which cannot be turned back into the password — not by us either',
              'While the account exists',
            ],
            [
              'Sign-in events: the time, the IP address, the browser string, and whether it worked',
              'So that we can tell you if someone has been trying to get into your account',
              '12 months',
            ],
            [
              'A session cookie',
              'To keep you signed in without asking for your password on every page',
              '30 days, or until you sign out',
            ],
          ],
        },
      ],
    },
    {
      id: 'how-we-get-it',
      title: 'How we get it',
      blocks: [
        { kind: 'text', text: 'Two ways, and only two:' },
        {
          kind: 'list',
          items: [
            'you type it into a form on this site, or send it to us in an email',
            'your browser tells our server your IP address and browser string when it asks for a page, the way every browser does',
          ],
        },
        {
          kind: 'text',
          text: 'We do not buy lists. We do not enrich what you give us with data bought from anyone else. We do not track you across other websites.',
        },
      ],
    },
    {
      id: 'who-sees-it',
      title: 'Who else sees it',
      blocks: [
        { kind: 'text', text: 'Almost nobody. Specifically:' },
        {
          kind: 'list',
          items: [
            'the company that rents us the server this runs on, which holds the disk the database sits on',
            'an authority we are legally required to give it to — and then only the part the order actually asks for',
          ],
        },
        {
          kind: 'text',
          text: 'We do not sell your data, we do not rent it, and we do not hand it to anyone for their advertising. We have no advertising partners to hand it to.',
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      blocks: [
        {
          kind: 'text',
          text: 'One cookie, and it exists to keep you signed in. It is set only after you sign in, and it carries a session token — not your name, not your email, and not your password.',
        },
        {
          kind: 'list',
          items: [
            'HttpOnly, so JavaScript on the page cannot read it',
            'Secure, so it is only ever sent over HTTPS',
            'SameSite=Lax, so another website cannot make your browser send it',
          ],
        },
        {
          kind: 'text',
          text: 'There are no analytics cookies, no advertising cookies and no third-party trackers on this site. That is why you have not been shown a cookie banner: there is nothing to ask your permission for.',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security measures',
      blocks: [
        { kind: 'text', text: 'What actually protects the data described above:' },
        {
          kind: 'list',
          items: [
            'passwords are hashed with bcrypt before they are stored, and are never written to a log',
            'everything between your browser and our server travels over HTTPS',
            'sign-in attempts are rate limited, and an account locks itself after repeated failures',
            'an account can only reach what its role allows, and roles are set from the server, never from the browser',
            'the database is not reachable from the internet — only the application can talk to it',
            'every sign-in, failed attempt and password change is written to an audit log',
          ],
        },
        {
          kind: 'text',
          text: 'What we do not claim: Difaac is not ISO 27001 certified and has not been audited by an outside firm. We are a young company and we would rather say that plainly than imply otherwise. When it changes, this section will say so and will name the certificate.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      blocks: [
        { kind: 'text', text: 'You can ask us to:' },
        {
          kind: 'list',
          items: [
            'tell you what we hold about you',
            'correct anything that is wrong',
            'delete it',
            'send you a copy of it',
            'stop using it, and stop writing to you',
          ],
        },
        {
          kind: 'text',
          text: `Write to ${CONTACT_EMAIL}. We reply within 30 days and it costs nothing. If our answer does not satisfy you, say so — one of the founders will look at it personally, because there are few enough of us that this is still possible.`,
        },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        {
          kind: 'text',
          text: 'Nothing on this site is aimed at children, and we do not knowingly collect anything from anyone under 16. If you believe a child has sent us something, write to us and we will delete it.',
        },
      ],
    },
    {
      id: 'other-sites',
      title: 'Other websites',
      blocks: [
        {
          kind: 'text',
          text: 'We link to other sites — research, advisories, sources for something we have written. Once you follow one of those links you are on someone else’s site, under their policy and not ours. We do not control what they collect.',
        },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [
        {
          kind: 'text',
          text: 'This page will change as the platform does. The date at the top is when it last changed. If a change genuinely affects people whose data we hold, we email them rather than quietly editing the page.',
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      blocks: [
        {
          kind: 'list',
          items: [CONTACT_EMAIL, CONTACT_PHONE, ADDRESS],
        },
        {
          kind: 'text',
          text: 'A question about this page reaches a person who worked on the system it describes, not a support queue.',
        },
      ],
    },
  ],
}

export const termsOfUse: LegalDocument = {
  title: 'Terms of use',
  version: 'September 2026',
  summary: 'The agreement between Difaac and anyone using this website.',
  intro: [
    {
      kind: 'text',
      text: 'These terms are the agreement between Difaac and you when you use this website. Using it means you accept them. If you do not accept them, stop using the site.',
    },
    {
      kind: 'text',
      text: 'They are written in plain language. That does not make them any less binding — it means we would rather you understood what you were agreeing to.',
    },
  ],
  sections: [
    {
      id: 'general',
      title: '1. General',
      blocks: [
        {
          kind: 'list',
          items: [
            '1.1. Difaac operates this website and everything published on it.',
            '1.2. We may change these terms. The version on this page is the one that applies, and the date at the top says when it last changed.',
            '1.3. In these terms, "the site" means this website and its content, and "you" means whoever is using it.',
          ],
        },
      ],
    },
    {
      id: 'what-is-ours',
      title: '2. What belongs to us',
      blocks: [
        {
          kind: 'list',
          items: [
            '2.1. The text, research, reports, code, diagrams, images, the Difaac name and mark, the design, and the way all of it is arranged belong to Difaac or to whoever licensed them to us.',
            '2.2. You may read any of it. You may quote a reasonable amount of it for comment, teaching, research or reporting, as long as you name Difaac as the source and link back to the page you took it from.',
            '2.3. Anything beyond that — republishing a report, translating one, putting our material behind your own brand — needs our written permission first. Ask us; the answer is often yes.',
          ],
        },
      ],
    },
    {
      id: 'what-you-may-not-do',
      title: '3. What you may not do',
      blocks: [
        { kind: 'text', text: '3.1. Using this site, you agree not to:' },
        {
          kind: 'list',
          items: [
            'republish our work as your own, or strip our name off it',
            'build a site designed to be mistaken for ours, or claim a partnership with Difaac that does not exist',
            'use our name or mark in a way that suggests we endorse you or your product',
            'use the demo and contact forms for anything other than contacting us — no advertising, no bulk sending, no using them to test whether somebody else’s address exists',
            'put another person’s personal data into our forms unless you are allowed to, or pretend to be someone you are not',
            'scan, attack, overload or reverse-engineer this site or the platform behind it',
          ],
        },
        {
          kind: 'text',
          text: '3.2. If you do any of these, we can cut off your access without warning you first.',
        },
        {
          kind: 'text',
          text: '3.3. Security researchers are an exception worth stating: if you find a flaw in this site, tell us before you tell anyone else and we will not treat you as an attacker. Write to the address in section 10.',
        },
      ],
    },
    {
      id: 'reports',
      title: '4. Our research and reports',
      blocks: [
        {
          kind: 'list',
          items: [
            '4.1. Research we publish describes what we saw at the time we wrote it. Threats move; a report does not.',
            '4.2. A report is information, not advice about your particular systems. Reading one is not a substitute for looking at your own environment, and we are not liable for a decision you made because of one.',
            '4.3. We describe attacker techniques so that defenders can recognise them. Using anything in our research to attack a system you do not own is a breach of these terms and, in most places, of the law.',
          ],
        },
      ],
    },
    {
      id: 'incident-reports',
      title: '5. Telling us about an incident',
      blocks: [
        {
          kind: 'list',
          items: [
            '5.1. If you report an incident to us, send what is needed to understand it and no more.',
            '5.2. If what you send contains someone else’s personal data, you are confirming you were entitled to send it.',
            '5.3. We treat an incident report as confidential. We will not publish it, or name you, without asking you first.',
            '5.4. Sending us a report does not create a contract and does not, by itself, mean we have taken on the work. If we are going to act, we will tell you so in writing.',
          ],
        },
      ],
    },
    {
      id: 'demos-and-accounts',
      title: '6. Demos, trials and accounts',
      blocks: [
        {
          kind: 'list',
          items: [
            '6.1. Asking for a demo is a request, not a contract. Any service we actually provide is governed by the agreement we sign for it, and where that agreement and this page disagree, the agreement wins.',
            '6.2. A platform account is yours alone. Do not share the password and do not let someone else use it. What happens under your account is treated as done by you.',
            '6.3. Tell us as soon as you think an account has been compromised, and we will end its sessions.',
            '6.4. We can suspend an account that is being used in a way that endangers the platform or anyone else on it.',
          ],
        },
      ],
    },
    {
      id: 'external-links',
      title: '7. Links to other sites',
      blocks: [
        {
          kind: 'text',
          text: 'We link out to sources, advisories and research. We do not control those sites and we are not responsible for what they contain or what they do with your data once you are there.',
        },
      ],
    },
    {
      id: 'no-warranty',
      title: '8. What we do not promise',
      blocks: [
        {
          kind: 'list',
          items: [
            '8.1. This site is provided as it is. We work to keep it accurate and available; we do not promise it will be either at any particular moment.',
            '8.2. No security product and no security service makes an organisation safe. Anything on this site that describes what Difaac does is a description of the work, not a guarantee of an outcome.',
          ],
        },
      ],
    },
    {
      id: 'liability',
      title: '9. Liability',
      blocks: [
        {
          kind: 'list',
          items: [
            '9.1. We are not liable for losses that follow from using this website — lost profit, lost data, lost business, or work interrupted.',
            '9.2. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for fraud. No law would let us do that, and we would not want to.',
          ],
        },
      ],
    },
    {
      id: 'governing-law',
      title: '10. Governing law',
      blocks: [
        {
          kind: 'list',
          items: [
            `10.1. These terms are governed by the law of Somaliland, and a dispute about them belongs to the courts of ${ADDRESS}.`,
            `10.2. Before it gets that far, write to ${CONTACT_EMAIL}. Most disagreements are a misunderstanding, and we would rather fix one in an email than in a courtroom.`,
          ],
        },
      ],
    },
    {
      id: 'terms-contact',
      title: '11. Contact',
      blocks: [
        {
          kind: 'list',
          items: [CONTACT_EMAIL, CONTACT_PHONE, ADDRESS],
        },
      ],
    },
  ],
}
