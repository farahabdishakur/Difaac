import { ArrowRight, Radar } from 'lucide-react'
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
              <LinkButton
                href="/products"
                variant="secondary"
                size="lg"
                className="border-line-soft bg-white/[0.03] backdrop-blur-md hover:border-brand/50 hover:bg-brand/5"
              >
                Explore products
              </LinkButton>
            </div>
          </div>

          {/* Glass frame around the dashboard mockup: a blurred brand-colour
              glow behind a translucent, backdrop-blurred panel, so the image
              reads as an object sitting in the scene rather than a screenshot
              pasted on top of it — the same glass surface used for icons
              throughout the product pages, applied here at card scale. */}
          <div className="relative w-full">
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand/20 opacity-60 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-brand/15 opacity-50 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative rounded-2xl border border-brand/25 bg-white/[0.03] p-2 shadow-[0_0_60px_-12px_var(--color-brand)] backdrop-blur-md">
              <img
                src="/hero-image.png"
                alt="Difaac Threat Intelligence Platform dashboard"
                width={900}
                height={600}
                loading="eager"
                className="w-full rounded-xl"
              />

              {/* Floating live-status chip, glass-surfaced like the rest of the
                  frame — a small sign of life on an otherwise static image. */}
              <div className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-full border border-brand/30 bg-ink/80 px-3.5 py-2 shadow-lg backdrop-blur-md sm:left-8">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                <Radar className="size-3.5 text-brand" aria-hidden="true" />
                <span className="text-xs font-medium text-text">Live threat monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
