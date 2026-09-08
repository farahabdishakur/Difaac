import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Faq } from '@/lib/data/product-faqs'

/**
 * The FAQ accordion that closes group-ib.com's product pages.
 *
 * One item is open at a time. Built on real buttons and an `aria-expanded`
 * relationship rather than the `<details>` element, so the open/close state is
 * announced to a screen reader and the icon can animate — and so keyboard
 * focus lands exactly where a sighted user clicks.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)

  if (faqs.length === 0) return null

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq, index) => {
        const isOpen = open === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`
        return (
          <div key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-base font-medium text-text sm:text-lg">
                  {faq.question}
                </span>
                <Plus
                  className={`size-5 shrink-0 text-brand transition-transform duration-200 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                  aria-hidden="true"
                  strokeWidth={1.6}
                />
              </button>
            </h3>
{/* The panel stays in the DOM and is hidden, so the grid-rows transition can animate its height rather than snapping. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-7"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-body sm:text-base">{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
