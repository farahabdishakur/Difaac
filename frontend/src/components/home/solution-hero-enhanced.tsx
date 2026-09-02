import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { getIcon } from '@/components/icons/icon-map'
import { solutionGroupAccent, toneBadge, toneGlow } from '@/lib/tone'
import type { Solution } from '@/lib/data/solutions'

interface SolutionHeroProps {
  name: string
  tagline: string
  description: string
  icon: string
  group: Solution['group']
}

export function SolutionHeroEnhanced({ name, tagline, description, icon, group }: SolutionHeroProps) {
  const Icon = getIcon(icon)
  // Accent follows the solution's group (use-case / role / industry) rather
  // than the individual slug — see `solutionGroupAccent` in `@/lib/tone`.
  const tone = solutionGroupAccent[group]

  return (
    <section className="relative overflow-hidden border-b border-brand/20 bg-gradient-to-b from-ink via-brand-ink/20 to-ink pt-20 pb-24 lg:pt-28 lg:pb-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-30 ${toneGlow[tone]}`} />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-cyan/10 blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-brand/10 blur-3xl opacity-20" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm ${toneBadge[tone]}`}>
            <Icon className="size-4" />
            <span className="text-sm font-medium">{name}</span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(30px,4vw,50px)] font-semibold leading-[1.15] tracking-tight text-text">
            {tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-body leading-relaxed">
            {description}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton href="/talk-to-sales" size="lg" className="gap-2">
              Let's Talk
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/products" variant="secondary" size="lg">
              View Products
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
