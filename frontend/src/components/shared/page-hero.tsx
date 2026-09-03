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
  /** Accent for the wash behind the hero. Brand green unless a page overrides it. */
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
  tone = 'brand',
}: PageHeroProps) {
  return (
    // `hero-ground` plus the negative margin is what the company page hero
    // does: the green runs up behind the transparent header and settles into
    // the page ground below, so the section has no top edge. Every page hero
    // shares it rather than a flat `bg-ink` panel that starts under the nav.
    <section className="hero-ground relative -mt-14 overflow-hidden pt-[calc(3.5rem+4rem)] pb-16 sm:pb-20 lg:-mt-16 lg:pt-[calc(4rem+5rem)] lg:pb-24">
      <HeroBackdrop tone={tone} />
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

          <h1 className="text-balance font-display t-h1 font-semibold leading-[1.15] text-text">
            {title}
          </h1>

          <p className="max-w-2xl text-pretty leading-relaxed text-body t-lead">
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


