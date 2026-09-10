import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'

export function HeroSection() {
  return (
    // Padding equal to the header plus the same air, top and bottom. The
    // section runs up underneath the header, so matching the raw figures would
    // put the content low: 64px of it is hidden behind the header, leaving 47
    // visible above against 112 below. Counting the header only on the top
    // gives the same amount of visible air on each side.
    <section className="relative -mt-14 overflow-hidden bg-ink pt-[calc(3.5rem+3.5rem)] pb-14 lg:-mt-16 lg:pt-[calc(4rem+4rem)] lg:pb-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Centred on a phone, where the column is the whole width and left
              alignment reads as lopsided; left-aligned from lg up, beside the
              artwork. */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            {/* A quiet line that says plainly what Difaac is before the headline says what it does — one small accent, nothing more. */}
            <span className="text-sm font-medium tracking-wide text-brand">
              Intelligent cyber defence
            </span>

            {/* A fixed two-line lockup: "Fight Somalian" on the first line and
                "Cybercrime." on the second, at every width — mobile, tablet and
                desktop. The break is hard on purpose so the headline reads the
                same shape on every screen. */}
            <h1 className="t-display mt-4 font-display font-bold text-text">
              Fight Somalian
              <br />
              <span className="text-brand">Cybercrime.</span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-pretty leading-relaxed text-body text-base sm:text-lg">
              Our cyber defence, fraud protection and brand protection are powered by
              intelligence-driven technology and analysts who track the adversaries operating
              across Somalia and its diaspora.
            </p>

            {/* Side by side from the smallest screen up — the two calls sit on
                one row on a phone rather than stacking — and centred under the
                text on mobile, left-aligned from lg. `flex-wrap` is the safety
                valve if a translation ever makes the labels too wide to share
                a narrow row. */}
            <div className="mt-10 flex flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
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

          {/* The artwork carries its own light, so nothing is laid behind or
              over it: the glow that used to sit here and the scrim that used to
              fade its lower edge were both washing out an image that already
              reads on a dark ground. */}
          <div className="w-full">
            {/* The intrinsic size is declared so the browser reserves the right box before the file arrives. Without it the row has no height on the first paint, and the headline beside it is drawn centred against nothing — then jumps when the image lands. */}
            <img
              src="/hero-image.webp"
              alt="Difaac unified cyber defense platform"
              width={1112}
              height={941}
              className="h-auto w-full"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
