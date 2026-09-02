import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { HeroBackdrop } from '@/components/product/product-emblem'
import type { Tone } from '@/lib/tone'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  breadcrumb?: { label: string; href?: string }[]
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  icon?: LucideIcon
  backgroundImage?: string
  /** Opt-in glass wash behind the hero, in this tone. Omit for the plain background most pages use. */
  tone?: Tone
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  primaryCta = { label: "Let's talk", href: '/talk-to-sales' },
  secondaryCta,
  icon: Icon,
  backgroundImage,
  tone,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20 lg:py-24">
      {tone ? <HeroBackdrop tone={tone} /> : null}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}

        <div className="flex max-w-3xl flex-col gap-4">
          {Icon ? (
            <span className="flex size-11 items-center justify-center rounded-[4px] border border-line bg-ink-2 text-brand">
              <Icon className="size-5" aria-hidden="true" strokeWidth={1.5} />
            </span>
          ) : null}

          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-2">
            {eyebrow}
          </span>

          <h1 className="text-balance font-display text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.15] tracking-tight text-text">
            {title}
          </h1>

          <p className="max-w-2xl text-pretty leading-relaxed text-body text-[clamp(16px,1.4vw,18px)]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <LinkButton href={primaryCta.href} size="lg">
            {primaryCta.label}
            <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
          </LinkButton>
          {secondaryCta ? (
            <LinkButton href={secondaryCta.href} variant="secondary" size="lg">
              {secondaryCta.label}
            </LinkButton>
          ) : null}
        </div>
      </div>
    </section>
  )
}


