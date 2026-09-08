import { useId, useState } from 'react'

/**
 * Security events per day, as an area chart.
 *
 * One series, so there is no legend — the panel title names what is plotted,
 * and a legend box for a single thing is furniture. One hue for the same
 * reason: the reader's job here is "is activity rising", which is magnitude
 * over time, not telling series apart.
 *
 * Drawn as inline SVG rather than pulling in a chart library. The shape is a
 * polyline and a fill; a library would add far more weight than it saves, and
 * the hover behaviour below is the part that actually needed writing.
 */

export type TrendPoint = { day: string; count: number }

const WIDTH = 640
const HEIGHT = 180
const PAD = { top: 12, right: 8, bottom: 24, left: 30 }

function formatDay(iso: string): string {
  // Parsed as UTC — the API sends plain dates, and letting the browser read
  // them as local time shifts every label by a day west of Greenwich.
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function ActivityTrend({ series, loading }: { series: TrendPoint[]; loading?: boolean }) {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  if (loading) {
    return <div className="h-[180px] animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
  }
  if (series.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-2">No activity recorded yet.</p>
  }

  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  // The axis always includes zero and never tops out exactly at the peak, so
  // the busiest day does not touch the ceiling and read as clipped.
  const peak = Math.max(...series.map((p) => p.count), 1)
  const ceiling = Math.ceil(peak * 1.15) || 1

  const x = (i: number) => PAD.left + (series.length === 1 ? plotW / 2 : (i / (series.length - 1)) * plotW)
  const y = (v: number) => PAD.top + plotH - (v / ceiling) * plotH

  const line = series.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.count).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(series.length - 1).toFixed(1)} ${(PAD.top + plotH).toFixed(1)} L ${x(0).toFixed(1)} ${(PAD.top + plotH).toFixed(1)} Z`

  const active = hover === null ? null : series[hover]

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Security events per day over the last ${series.length} days`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

{/* Grid and axis labels, kept recessive: they are a reference the eye checks against, not something to read. */}
        {[0, 0.5, 1].map((t) => {
          const gy = PAD.top + plotH - t * plotH
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={gy}
                y2={gy}
                stroke="var(--color-line)"
                strokeWidth="1"
              />
              <text x={PAD.left - 8} y={gy + 3} textAnchor="end" className="fill-muted-2 text-[9px]">
                {Math.round(t * ceiling)}
              </text>
            </g>
          )
        })}

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

{/* First and last day only. A label under every point is noise at this width, and those two are what set the window. */}
        {[0, series.length - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={HEIGHT - 6}
            textAnchor={i === 0 ? 'start' : 'end'}
            className="fill-muted-2 text-[9px]"
          >
            {formatDay(series[i].day)}
          </text>
        ))}

        {active ? (
          <>
            <line
              x1={x(hover!)}
              x2={x(hover!)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--color-brand)"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
{/* A surface ring around the marker so it stays visible wherever on the area it lands. */}
            <circle cx={x(hover!)} cy={y(active.count)} r="5" fill="var(--color-ink)" />
            <circle cx={x(hover!)} cy={y(active.count)} r="4" fill="var(--color-brand)" />
          </>
        ) : null}

{/* Full-height hit targets, one per day: the pointer never has to find a 4px dot. */}
        {series.map((p, i) => (
          <rect
            key={p.day}
            x={x(i) - plotW / (series.length * 2)}
            y={PAD.top}
            width={plotW / series.length}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {active ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[4px] border border-line bg-ink px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: `${(x(hover!) / WIDTH) * 100}%`, top: `${(y(active.count) / HEIGHT) * 100}%` }}
        >
          <div className="font-medium text-text">
            {active.count} {active.count === 1 ? 'event' : 'events'}
          </div>
          <div className="text-muted-2">{formatDay(active.day)}</div>
        </div>
      ) : null}
    </div>
  )
}
