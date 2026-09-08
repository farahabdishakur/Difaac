import { CheckCircle2 } from 'lucide-react'
import { GlassIcon } from '@/components/product/product-sections'
import { solutionGroupAccent } from '@/lib/tone'
import type { Solution } from '@/lib/data/solutions'

interface SolutionHighlightsProps {
  highlights: string[]
  group: Solution['group']
}

export function SolutionHighlights({ highlights, group }: SolutionHighlightsProps) {
  const tone = solutionGroupAccent[group]

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
            Key Features
          </span>
          <h2 className="mt-6 font-display t-h3 font-medium text-text">
            What you get
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex gap-4 rounded-lg border border-line-soft bg-ink-2/60 p-6 backdrop-blur-sm transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <GlassIcon icon={CheckCircle2} tone={tone} size="sm" />
              <div>
                <p className="text-sm leading-relaxed text-body">{highlight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
