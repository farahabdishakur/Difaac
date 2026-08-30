import type { LucideIcon } from 'lucide-react'
import type { Tone } from '@/lib/tone'
import { toneChip } from '@/lib/tone'

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  loading,
}: {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: Tone
  loading?: boolean
}) {
  return (
    <div className="flat-card flex items-center gap-4 p-5">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-[4px] ${toneChip[tone]}`}>
        <Icon className="size-5" aria-hidden="true" strokeWidth={1.8} />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-2xl font-semibold tracking-tight text-text">
          {loading ? '—' : value}
        </span>
        <span className="text-xs uppercase tracking-wide text-muted-2">{label}</span>
      </div>
    </div>
  )
}
