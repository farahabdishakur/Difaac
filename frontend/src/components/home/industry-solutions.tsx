import { CheckCircle2, ArrowRight } from 'lucide-react'
import { GlassIcon } from '@/components/product/product-sections'
import { INDUSTRY_ACCENT } from '@/lib/tone'

interface Solution {
  product: string
  benefit: string
}

interface IndustrySolutionsProps {
  solutions: Solution[]
  industryName: string
}

export function IndustrySolutions({ solutions, industryName }: IndustrySolutionsProps) {
  return (
    <section className="relative bg-gradient-to-b from-ink to-ink-2 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
            How Difaac Helps
          </span>
          <h2 className="mt-6 font-display text-[clamp(22px,2.6vw,32px)] font-semibold leading-tight text-text">
            Solutions built for {industryName}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="group flex flex-col gap-4 rounded-lg border border-line-soft bg-ink-2/60 p-8 backdrop-blur-sm transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <div className="flex items-start gap-4">
                <GlassIcon icon={CheckCircle2} tone={INDUSTRY_ACCENT} />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-text">{solution.product}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{solution.benefit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-brand text-sm font-semibold transition-all group-hover:gap-3">
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
