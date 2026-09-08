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
            {/* A quiet line that says plainly what Difaac is before the
                headline says what it does — one small accent, nothing more. */}
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand">
              Intelligent cyber defence
            </span>

            {/* Two-tone, weight 400: the emphasis is the colour on the
                operative word, never a heavier stroke. The same rule the
                company pages follow, so the site reads as one system rather
                than a home page and a set of other pages. */}
            <h1 className="mt-4 text-balance font-display text-[clamp(34px,5vw,56px)] font-normal leading-[1.08] tracking-[-0.03em] text-text">
              <span>Fight Somalian</span>
              <br />
              <span className="text-brand">cybercrime.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-body text-base sm:text-lg">
              Difaac is a cyber defence platform built for organisations across Somalia and the
              Horn of Africa. We track the groups behind ransomware, fraud, and brand abuse, and
              give your team the intelligence to stop them before they do real harm.
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

          {/* Right: hero artwork, transparent so it sits directly on the page ground */}
          <div className="relative w-full">
            <div
              className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-brand/20 opacity-60 blur-3xl"
              aria-hidden="true"
            />
            {/* The intrinsic size is declared so the browser reserves the
                right box before the file arrives. Without it the row has no
                height on the first paint, and the headline beside it is drawn
                centred against nothing — then jumps when the image lands. */}
            <img
              src="/hero-image.png"
              alt="Difaac unified cyber defense platform"
              width={1112}
              height={941}
              className="relative h-auto w-full"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
