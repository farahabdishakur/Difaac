/**
 * Interactive challenges explorer.
 *
 * Modelled on group-ib.com's role/industry pages, which present a row of
 * challenge tabs rather than a static grid — a visitor scanning for "does
 * this apply to me" reads five titles in one glance instead of scrolling
 * past long paragraphs. Reuses the exact tab interaction from
 * `ProductTabs` and the glass icon from the product pages, so an industry
 * page and a product page feel like the same system rather than two
 * different ones glued together.
 */

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { GlassIcon } from '@/components/product/product-sections'
import { INDUSTRY_ACCENT, toneBadge, toneText } from '@/lib/tone'

interface Challenge {
  title: string
  description: string
}

interface IndustryChallengesProps {
  challenges: Challenge[]
}

export function IndustryChallenges({ challenges }: IndustryChallengesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const tone = INDUSTRY_ACCENT
  const active = challenges[activeIndex]

  if (!active) return null

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-medium text-brand">
            Industry Challenges
          </span>
          <h2 className="mt-6 font-display text-[clamp(22px,2.6vw,32px)] font-semibold leading-tight text-text">
            Threats unique to your industry
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr] lg:items-start">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Industry challenges">
            {challenges.map((challenge, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={challenge.title}
                  type="button"
                  role="tab"
                  id={`challenge-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls={`challenge-panel-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`group flex items-start gap-3 rounded-lg border px-4 py-3 text-left backdrop-blur-sm transition-all duration-200 ${
                    isActive
                      ? `${toneBadge[tone]} border`
                      : 'border-line-soft hover:border-brand/30 hover:bg-ink-2/40'
                  }`}
                >
                  <AlertTriangle
                    className={`mt-0.5 size-4 shrink-0 ${isActive ? toneText[tone] : 'text-muted-2 group-hover:text-brand/60'}`}
                    aria-hidden="true"
                  />
                  <span className={`text-sm font-medium ${isActive ? 'text-text' : 'text-muted-2 group-hover:text-body'}`}>
                    {challenge.title}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`challenge-panel-${activeIndex}`}
            aria-labelledby={`challenge-tab-${activeIndex}`}
            className="rounded-lg border border-line-soft bg-ink-2/60 p-8 backdrop-blur-sm lg:p-10"
          >
            <div className="flex items-start gap-4">
              <GlassIcon icon={AlertTriangle} tone={tone} />
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold text-text">{active.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body">{active.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
