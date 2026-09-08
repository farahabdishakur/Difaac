/**
 * A 0-100 score drawn as a single arc.
 *
 * Used for figures the dashboard derives rather than counts (exposure,
 * average risk), so they read as a judgement at a glance instead of another
 * number in a row of counts. The caption underneath carries how the figure
 * was derived — a score with no stated basis is one an analyst learns to
 * scroll past.
 */

const BAND = [
  { min: 70, label: 'High', className: 'text-error', stroke: 'var(--color-error)' },
  { min: 40, label: 'Elevated', className: 'text-warning', stroke: 'var(--color-warning)' },
  { min: 0, label: 'Low', className: 'text-brand', stroke: 'var(--color-brand)' },
]

function bandFor(score: number) {
  return BAND.find((band) => score >= band.min) ?? BAND[BAND.length - 1]
}

export function ScoreDial({
  score,
  caption,
  loading,
}: {
  score: number
  caption: string
  loading?: boolean
}) {
  const band = bandFor(score)
  // A semicircle of radius 54: length = pi * r, so the dash offset below maps
  // the score directly onto the arc without a magic constant.
  const radius = 54
  const arcLength = Math.PI * radius
  const filled = loading ? 0 : (Math.min(Math.max(score, 0), 100) / 100) * arcLength

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg viewBox="0 0 140 78" className="w-40" role="img" aria-label={`Score ${score} of 100`}>
          <path
            d="M 16 70 A 54 54 0 0 1 124 70"
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 16 70 A 54 54 0 0 1 124 70"
            fill="none"
            stroke={band.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${arcLength}`}
            className="transition-[stroke-dasharray] duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className={`font-display text-3xl font-medium tabular-nums ${band.className}`}>
            {loading ? '—' : score}
          </span>
          <span className="text-[11px] uppercase tracking-wide text-muted-2">{band.label}</span>
        </div>
      </div>
      <p className="max-w-[15rem] text-center text-xs leading-relaxed text-muted-2">{caption}</p>
    </div>
  )
}
