import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * The closing call to action.
 *
 * group-ib.com ends its long pages with one centred sentence and a single
 * button, over a dark texture rather than a flat panel — the ask reads as a
 * deliberate stop rather than one more card. That shape is followed here.
 *
 * The texture is Difaac's own (generated, near-black, grain over a few soft
 * blooms) rather than a licensed photograph, and it is a `background-image`
 * on the section instead of an `<img>` so it never enters the accessibility
 * tree and never delays the text painting.
 */

type CTABannerProps = {
  title: string
  description?: string
  /** Rendered in the brand gradient inside the title, if it appears there. */
  highlight?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

/**
 * A button whose label slides up and is replaced by a copy of itself.
 *
 * Two spans rather than one: animating a single label to and from the same
 * text cannot cross-fade, and swapping `textContent` on hover would fight the
 * screen reader. The duplicate is `aria-hidden`, so assistive technology
 * still sees exactly one label.
 */
function SlideUpLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative grid overflow-hidden">
      <span className="col-start-1 row-start-1 transition-[transform,opacity] duration-200 ease-out group-hover:-translate-y-full group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:opacity-100">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 translate-y-full opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  )
}

export function CTABanner({
  title,
  description,
  highlight,
  primaryCta = { label: 'Talk to an expert', href: '/talk-to-sales' },
  secondaryCta,
}: CTABannerProps) {
  // Split on the highlighted phrase so it can carry the gradient without the
  // caller having to pass markup — a `title` that is plain text cannot become
  // an injection vector the way an HTML string could.
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, '']

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/cta-texture.jpg)' }}
        aria-hidden="true"
      />
      {/* Darkens the edges so the texture reads as depth in the middle while
          the headline keeps its contrast. Light enough that the background is
          visibly there — a scrim heavy enough to guarantee contrast on any
          texture would make having one pointless. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-ink/80"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-7 px-6 py-16 text-center sm:px-10 lg:py-20">
        <h2 className="max-w-3xl text-balance font-display text-[clamp(24px,3vw,38px)] font-semibold leading-tight tracking-tight text-text">
          {before}
          {after ? (
            <span className="bg-gradient-to-r from-brand via-brand-bright to-brand-ultra bg-clip-text text-transparent">
              {highlight}
            </span>
          ) : null}
          {after}
        </h2>

        {description ? (
          <p className="max-w-2xl text-pretty leading-relaxed text-body">{description}</p>
        ) : null}

        <div className="mt-1 flex flex-wrap justify-center gap-3">
          <Link
            to={primaryCta.href}
            className="group inline-flex h-11 items-center gap-2 rounded-[50px] border border-brand bg-brand px-6 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:bg-brand-bright"
          >
            <SlideUpLabel>{primaryCta.label}</SlideUpLabel>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </Link>

          {secondaryCta ? (
            <Link
              to={secondaryCta.href}
              className="group inline-flex h-11 items-center rounded-[50px] border border-line-soft bg-white/[0.03] px-6 text-sm font-semibold text-text backdrop-blur-sm transition-colors duration-200 hover:border-brand/50 hover:text-brand"
            >
              <SlideUpLabel>{secondaryCta.label}</SlideUpLabel>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
