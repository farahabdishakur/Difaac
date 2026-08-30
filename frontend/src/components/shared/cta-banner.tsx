import { LinkButton } from '@/components/shared/link-button'

type CTABannerProps = {
  title: string
  description: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function CTABanner({
  title,
  description,
  primaryCta = { label: 'Talk to an expert', href: '/talk-to-sales' },
  secondaryCta = { label: 'Request demo', href: '/talk-to-sales' },
}: CTABannerProps) {
  return (
    <div className="border border-line bg-ink-2 p-8 sm:p-12 lg:p-16 rounded-[4px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex max-w-2xl flex-col gap-4">
          <h2 className="text-balance font-display text-[clamp(26px,3vw,38px)] font-semibold leading-tight tracking-tight text-text">
            {title}
          </h2>
          <p className="text-pretty leading-relaxed text-body">{description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <LinkButton href={primaryCta.href} size="lg">
            {primaryCta.label}
          </LinkButton>
          <LinkButton href={secondaryCta.href} variant="secondary" size="lg">
            {secondaryCta.label}
          </LinkButton>
        </div>
      </div>
    </div>
  )
}



