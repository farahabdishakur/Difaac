import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/shared/link-button'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { HeroBackdrop } from '@/components/product/product-emblem'
import { solutionGroupAccent } from '@/lib/tone'
import type { Solution } from '@/lib/data/solutions'

interface SolutionHeroProps {
  name: string
  tagline: string
  description: string
  group: Solution['group']
}

export function SolutionHeroEnhanced({ name, tagline, description, group }: SolutionHeroProps) {
  // Accent follows the solution's group (use-case / role / industry) rather
  // than the individual slug — see `solutionGroupAccent` in `@/lib/tone`.
  const tone = solutionGroupAccent[group]

  return (
    <section className="-mt-14 pt-[calc(3.5rem+4rem)] lg:-mt-16 lg:pt-[calc(4rem+5rem)] relative overflow-hidden pb-24 lg:pb-32">
      {/* The same wash the product and service heroes use: the accent carries
          up behind the transparent header and settles into the page ground,
          so the section has no top edge. */}
      <HeroBackdrop tone={tone} spread />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* The breadcrumb carries the solution's name, so the headline is free
            to be the promise rather than repeating the label — and the top of
            the hero is anchored rather than starting on empty space. */}
        <div className="mb-10 flex justify-center">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Solutions', href: '/solutions' },
              { label: name },
            ]}
          />
        </div>

        <div className="text-center">
          <h1 className="font-display t-h1 font-semibold leading-[1.15] text-text">
            {tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body">{description}</p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton href="/talk-to-sales" size="lg" className="gap-2">
              Let&apos;s Talk
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/products" variant="secondary" size="lg">
              View Products
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
