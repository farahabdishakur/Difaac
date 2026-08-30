/**
 * Colour-codes a severity or status string wherever the workspace shows one.
 *
 * The backend seeds free-text values (severity on IOCs and incidents, status
 * on phishing domains, fraud cases, and incidents), so this classifies by
 * keyword rather than an exhaustive enum — an unrecognised value still
 * renders, just in the neutral tone, instead of throwing.
 */
const toneByKeyword: { match: RegExp; classes: string }[] = [
  { match: /critical|high/i, classes: 'border-error/40 bg-error/10 text-error' },
  { match: /medium|warn|open|active|pending|review/i, classes: 'border-warning/40 bg-warning/10 text-warning' },
  { match: /low|resolved|closed|remediated|removed|confirmed/i, classes: 'border-brand/40 bg-brand/10 text-brand' },
]

function toneFor(value: string): string {
  const hit = toneByKeyword.find((entry) => entry.match.test(value))
  return hit?.classes ?? 'border-line bg-ink-3 text-muted-2'
}

export function SeverityBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-[3px] border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${toneFor(value)}`}
    >
      {value}
    </span>
  )
}
