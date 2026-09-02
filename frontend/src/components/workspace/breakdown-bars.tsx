/**
 * A labelled horizontal bar per category, sized against the largest value.
 *
 * The workspace shows several GROUP BY results — alerts by category, fraud by
 * detector, by channel — and they all want the same treatment: the relative
 * shape matters more than the exact number, but the number still has to be
 * readable. Scaling against the maximum rather than the total keeps a small
 * category visible instead of collapsing it to a sliver.
 */
export function BreakdownBars({
  items,
  tone = 'brand',
}: {
  items: { label: string; count: number }[]
  tone?: 'brand' | 'violet' | 'blue'
}) {
  const max = Math.max(...items.map((item) => item.count), 1)
  const barColor = {
    brand: 'bg-brand',
    violet: 'bg-accent-violet',
    blue: 'bg-accent-blue',
  }[tone]

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-sm capitalize text-body">{item.label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-2">{item.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-3">
            <div
              className={`h-full rounded-full ${barColor} transition-[width] duration-500 ease-out`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
