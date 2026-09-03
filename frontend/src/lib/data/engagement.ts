/**
 * Editorial content for the Services and Solutions index pages.
 *
 * Both pages were previously a hero followed by three identical card grids,
 * which told a reader nothing they could not get from the navigation. What
 * they were missing is the part a buyer actually weighs: for services, how an
 * engagement is run and what arrives at the end of it; for solutions, the
 * problem being solved before the product that solves it.
 *
 * Everything here describes how Difaac works, which is true from the first
 * contract. Nothing claims a history the company has not had — see the note
 * at the top of `company.ts`.
 */

export type Step = {
  title: string
  description: string
}

export type Challenge = {
  problem: string
  detail: string
  response: string
}

export type Faq = {
  question: string
  answer: string
}

/** How a Difaac engagement runs, start to finish. */
export const engagementSteps: Step[] = [
  {
    title: 'Scope in writing',
    description:
      'Targets, timing, rules of engagement, and escalation contacts are agreed and signed before anything starts. What falls outside the scope is written down too, so the boundary is not discovered halfway through.',
  },
  {
    title: 'Work run by the operator',
    description:
      'The person testing your systems is the person who writes your report. Findings are raised as they are confirmed rather than held to the end, so a critical issue reaches you the day it is found.',
  },
  {
    title: 'Evidence, not assertion',
    description:
      'Every finding carries reproduction steps, the artefacts behind it, and a stated confidence. Where the evidence does not support a conclusion, the report says so instead of rounding up.',
  },
  {
    title: 'Retest included',
    description:
      'Once you have fixed what was found, we verify the fix against the original evidence and reissue the report. A finding is not closed because it was reported — it is closed because it no longer reproduces.',
  },
]

/** The two ways an engagement is bought. */
export const engagementModels: { name: string; summary: string; points: string[] }[] = [
  {
    name: 'Scoped engagement',
    summary: 'A single piece of work with a fixed scope, price, and delivery date.',
    points: [
      'Penetration tests, red team exercises, and compromise assessments',
      'Written scope and fixed price agreed before work begins',
      'Report with evidence, and a retest once fixes land',
    ],
  },
  {
    name: 'Response retainer',
    summary: 'Terms signed in advance, so an incident does not start with a contract negotiation.',
    points: [
      'Contract and NDA settled while nothing is on fire',
      'Named escalation path and agreed response times',
      'Unused hours roll into assessment or training work',
    ],
  },
]

export const servicesFaqs: Faq[] = [
  {
    question: 'How is the scope of an engagement decided?',
    answer:
      'In a scoping call, and then in writing. We agree the systems in scope, the techniques permitted, the testing window, and who to call if something breaks. Nothing outside that document is touched.',
  },
  {
    question: 'What arrives at the end?',
    answer:
      'A report written by the operator who did the work: an executive summary, each finding with reproduction steps and evidence, a stated severity and confidence, and remediation advice specific to your environment rather than a generic reference.',
  },
  {
    question: 'What happens if you find something critical mid-engagement?',
    answer:
      'You hear about it that day, through the escalation path agreed in the scope. Critical findings are not held back for the final report.',
  },
  {
    question: 'Do you retest after we fix the findings?',
    answer:
      'Yes, and it is included in a scoped engagement rather than sold separately. We re-run the original evidence against the fix and reissue the report with the finding closed or still open.',
  },
  {
    question: 'Can you work under our existing NDA and procurement terms?',
    answer:
      'Yes. For response work we recommend settling that in advance under a retainer — an incident is the worst possible time to start a contract negotiation.',
  },
]

/**
 * The problems the solutions pages answer.
 *
 * Group-IB leads a solution page with the challenge rather than the product,
 * which is the right order: a reader arrives with a problem, not with a
 * shopping list. These are the three that come up across every sector Difaac
 * works in.
 */
export const solutionChallenges: Challenge[] = [
  {
    problem: 'You cannot see the attack until it lands',
    detail:
      'Most organisations learn they were targeted from the outcome — a locked file server, a fraudulent transfer, a customer reporting a fake login page. By then the decisions that mattered were made weeks earlier, on infrastructure nobody was watching.',
    response:
      'Intelligence-led detection puts the adversary’s infrastructure and methods in front of you before the campaign reaches your perimeter.',
  },
  {
    problem: 'The tools each see one piece',
    detail:
      'An endpoint alert, an unusual sign-in, and a lookalike domain registration are three separate tickets in three separate consoles. Read together they are one intrusion, but nothing in the stack reads them together.',
    response:
      'One platform correlates across endpoint, network, email, cloud, fraud, and brand, so a signal caught in one area raises the others.',
  },
  {
    problem: 'Alerts arrive faster than anyone can work them',
    detail:
      'A small team cannot triage everything a modern stack produces. The cost is not the noise itself — it is the confirmed intrusion sitting in a queue behind four hundred things that turned out to be nothing.',
    response:
      'Detections are validated by an analyst before they reach you, so what arrives is an escalation worth acting on rather than a queue to sort.',
  },
]
