import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import type { Tone } from '@/lib/tone'
import { toneText } from '@/lib/tone'

/**
 * The tabbed feature explorer — the component that carries a Group-IB product
 * page. A row of tabs switches the capability described beside the product's
 * own console, so the interface itself is the proof rather than a paragraph
 * claiming what the interface does.
 *
 * The screenshot is the real Difaac workspace for this product, not a mockup.
 * It stays constant across tabs because there is one honest console per
 * product; the tab row changes which capability of that console is described.
 */

/** Each product's real console screenshot, by slug. */
const CONSOLE_IMAGE: Record<string, string> = {
  'threat-intelligence': '/screenshots/workspace-threat-intelligence.webp',
  'fraud-protection': '/screenshots/workspace-fraud.webp',
  'managed-xdr': '/screenshots/workspace-managed-xdr.webp',
  'attack-surface-management': '/screenshots/workspace-attack-surface.webp',
  'digital-risk-protection': '/screenshots/workspace-digital-risk.webp',
  'business-email-protection': '/screenshots/workspace-email-protection.webp',
}

type Capability = { title: string; description: string }

export function ProductFeatureExplorer({
  slug,
  name,
  tone,
  capabilities,
}: {
  slug: string
  name: string
  tone: Tone
  capabilities: Capability[]
}) {
  const [active, setActive] = useState(0)
  const image = CONSOLE_IMAGE[slug]
  const activeTab = capabilities[active]

  // Keep the selected tab in view when the row scrolls on a narrow screen.
  const activeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <div className="flex flex-col gap-8">
{/* Tab row — one line, scrolling sideways rather than wrapping. */}
      <div
        role="tablist"
        aria-label={`${name} capabilities`}
        className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0"
      >
        {capabilities.map((cap, index) => {
          const isActive = index === active
          return (
            <button
              key={cap.title}
              ref={isActive ? activeRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(index)}
              className={`shrink-0 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? `bg-ink-3 ${toneText[tone]}` : 'text-body hover:text-text'
              }`}
            >
              {cap.title}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl font-medium text-text sm:text-2xl">{activeTab.title}</h3>
          <p className="text-pretty leading-relaxed text-body">{activeTab.description}</p>
          <span className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-2">
            Shown in the {name} console
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
          {image ? (
            <img
              src={image}
              alt={`The Difaac ${name} console`}
              className="w-full object-cover object-left-top"
              loading="lazy"
            />
          ) : (
            <div className="aspect-[16/10] w-full" />
          )}
{/* A play affordance the way Group-IB overlays one on the console still — here it links a viewer to the live workspace rather than a video, since the real thing exists. */}
          <a
            href="/sign-in"
            className="group absolute inset-0 flex items-center justify-center"
            aria-label={`Open the ${name} console`}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-ink shadow-lg transition-transform group-hover:scale-105">
              <Play className="size-4 fill-current" aria-hidden="true" />
              Open the console
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
