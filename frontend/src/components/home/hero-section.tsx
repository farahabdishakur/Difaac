import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'

export function HeroSection() {
  return (
    <section className="hero-ground -mt-14 pt-14 lg:-mt-16 lg:pt-16 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-display font-semibold leading-tight tracking-tight text-text text-[clamp(48px,7vw,72px)]">
            Fight modern cybercrime
          </h1>

          <p className="mt-8 text-pretty leading-relaxed text-body text-lg sm:text-xl">
            Difaac combines intelligence-driven technology with the judgement of experienced
            analysts to protect your organisation from cyber threats, fraud, and brand abuse.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <LinkButton href="/products" size="lg" className="flex-1 sm:flex-initial">
              Explore Products
              <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
            </LinkButton>
            <LinkButton
              href="/talk-to-sales"
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-initial border-line-soft bg-white/[0.03] backdrop-blur-md hover:border-brand/50 hover:bg-brand/5"
            >
              Talk to Sales
              <ArrowRight className="size-4" data-icon="inline-end" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>

        {/* Hero graphic: subtle accent glow for visual depth */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-brand/10 opacity-40 blur-3xl"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
