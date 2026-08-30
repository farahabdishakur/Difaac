import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'

export function HeroSection() {
  return (
    <section className="hero-ground -mt-14 pt-14 lg:-mt-16 lg:pt-16 relative overflow-hidden">
      {/* Settles the hero's colour wash back to the page ground at the fold, so
          the section below starts on flat colour rather than against a visible
          seam. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="text-balance font-display font-semibold leading-[1.06] tracking-tight text-text text-[clamp(40px,6vw,68px)]">
              Fight modern cybercrime
            </h1>

            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-body text-[clamp(16px,1.6vw,19px)]">
              Difaac combines intelligence-driven technology with the judgement of experienced
              analysts to protect your organisation from cyber threats, fraud, and brand abuse.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LinkButton href="/talk-to-sales" size="lg">
                Let&apos;s Talk
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/products" variant="secondary" size="lg">
                Explore products
              </LinkButton>
            </div>
          </div>

          <div className="w-full">
            <img
              src="/hero-image.png"
              alt="Difaac Threat Intelligence Platform dashboard"
              width={900}
              height={600}
              loading="eager"
              className="w-full rounded-[4px] border border-line"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
