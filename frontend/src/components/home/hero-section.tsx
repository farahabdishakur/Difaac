import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'

export function HeroSection() {
  return (
    <section className="hero-ground -mt-14 pt-14 lg:-mt-16 lg:pt-16 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Headline & CTAs */}
          <div className="max-w-2xl">
            <h1 className="text-balance font-display font-semibold leading-tight tracking-tight text-text text-[clamp(44px,6vw,64px)]">
              Fight modern cybercrime
            </h1>

            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-body text-base sm:text-lg">
              Difaac combines intelligence-driven technology with the judgement of experienced
              analysts to protect your organisation from cyber threats, fraud, and brand abuse.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <LinkButton href="/products" size="lg">
                Explore Products
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
              <LinkButton
                href="/talk-to-sales"
                variant="secondary"
                size="lg"
                className="border-line-soft bg-white/[0.03] backdrop-blur-md hover:border-brand/50 hover:bg-brand/5"
              >
                Talk to Sales
                <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>

          {/* Right: Product image with glassmorphism */}
          <div className="relative w-full">
            {/* Brand green glow behind image */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-2xl bg-brand/25 opacity-60 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-8 -right-8 size-56 rounded-full bg-brand/15 opacity-50 blur-3xl"
              aria-hidden="true"
            />

            {/* Glass-morphism frame */}
            <div className="relative rounded-2xl border border-brand/30 bg-white/[0.02] p-1 shadow-xl shadow-brand/20 backdrop-blur-md overflow-hidden">
              <img
                src="/hero-image.png"
                alt="Difaac Threat Intelligence Platform Dashboard"
                className="w-full rounded-xl block"
                loading="eager"
              />
            </div>

            {/* Floating status indicator */}
            <div className="absolute -bottom-3 left-6 flex items-center gap-2 rounded-full border border-brand/40 bg-ink/90 px-4 py-2 shadow-xl backdrop-blur-md sm:left-8">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              <span className="text-xs font-semibold text-text">Live threat monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
