import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getIcon } from '@/components/icons/icon-map'
import { ProductEmblem } from '@/components/product/product-emblem'
import { BrowserFrame } from '@/components/shared/browser-frame'
import { productAccent, toneText, toneGlow } from '@/lib/tone'
import type { Tone } from '@/lib/tone'
import { getProductBySlug } from '@/lib/data/products'
import { showcase, type ShowcaseEntry } from '@/lib/data/home-showcase'

/**
 * One full-width band per product, alternating which side the artwork sits on.
 *
 * This is the shape group-ib.com gives its homepage below the fold: rather
 * than a grid of six equal cards, each product gets the full width once — its
 * emblem, its name, a single headline, a short paragraph, and a look at the
 * real console. A grid asks the reader to compare six things at once; a
 * sequence of bands lets each one land on its own.
 *
 * Alternating sides is what stops six identical bands reading as a wall.
 */

function ShowcaseArt({ entry, tone, slug }: { entry: ShowcaseEntry; tone: Tone; slug: string }) {
  if (entry.screenshot) {
    return <BrowserFrame tone={tone} image={entry.screenshot.image} path={entry.screenshot.path} />
  }

  // Every product currently ships a console, so this path is unused today. It
  // stays as the honest fallback for the next product added: a mocked-up
  // screenshot would advertise an interface that does not exist, where the
  // emblem on its own panel reads as a deliberate choice.
  const Icon = getIcon(getProductBySlug(slug)?.icon ?? 'ShieldCheck')
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-line bg-ink-2">
      <div
        className={`pointer-events-none absolute inset-0 opacity-25 blur-3xl ${toneGlow[tone]}`}
        aria-hidden="true"
      />
      <ProductEmblem icon={Icon} tone={tone} slug={slug} size="hero" className="relative" />
    </div>
  )
}

function ShowcaseBand({ entry, index }: { entry: ShowcaseEntry; index: number }) {
  const product = getProductBySlug(entry.slug)
  if (!product) return null

  const tone = productAccent[entry.slug] ?? 'brand'
  const Icon = getIcon(product.icon)
  // Odd bands put the artwork first on desktop. `order` rather than a
  // reversed row so the text still comes first in the DOM, and therefore
  // first for a screen reader and on mobile, on every band.
  const artFirst = index % 2 === 1

  return (
    <section className="border-t border-line-soft py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={artFirst ? 'lg:order-2' : ''}>
            <div className="flex items-center gap-3">
              <ProductEmblem icon={Icon} tone={tone} slug={entry.slug} size="card" className="-m-1" />
              <Link
                to={`/products/${entry.slug}`}
                className={`tap-target text-sm font-medium transition-opacity hover:opacity-80 ${toneText[tone]}`}
              >
                {product.name}
              </Link>
            </div>

            <h2 className="mt-6 text-balance font-display t-h2 font-medium leading-[1.15] text-text">
              {entry.headline}
            </h2>

            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-body">{entry.description}</p>

            <Link
              to={`/products/${entry.slug}`}
              className="tap-target group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-bright"
            >
              Learn more
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className={artFirst ? 'lg:order-1' : ''}>
            <ShowcaseArt entry={entry} tone={tone} slug={entry.slug} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductShowcase() {
  return (
    <>
      {showcase.map((entry, index) => (
        <ShowcaseBand key={entry.slug} entry={entry} index={index} />
      ))}
    </>
  )
}
