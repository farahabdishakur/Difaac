import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { privacyPolicy, termsOfUse } from '@/lib/data/legal'
import type { LegalBlock, LegalDocument } from '@/lib/data/legal'

interface LegalPageProps {
  type: 'privacy' | 'terms'
}

/**
 * The privacy policy and the terms of use, which are the same page with
 * different content.
 *
 * Built the way group-ib.com builds its legal pages, which is to say barely
 * built at all: a title, the date it last changed, a list of the sections down
 * one side, and the text. No badges, no icons beside every heading, no card
 * announcing which standards the company complies with. A legal page is read
 * by someone looking for one specific sentence, so everything that is not that
 * sentence gets out of the way.
 *
 * The content lives in `@/lib/data/legal` — this file only lays it out.
 */

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'text') {
    return <p className="text-pretty leading-relaxed text-body">{block.text}</p>
  }

  if (block.kind === 'list') {
    return (
      <ul className="flex flex-col gap-2.5 pl-0">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-body">
            <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-brand" />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  // A table is the one place a legal page earns some structure: "what, why,
  // how long" is three columns of an answer, and prose makes it worse. It
  // scrolls inside its own box rather than widening the page on a phone.
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {block.head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="py-3 pr-6 font-medium text-text last:pr-0"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0]} className="border-b border-line-soft align-top">
              {row.map((cell, i) => (
                <td
                  key={cell}
                  className={`py-4 pr-6 leading-relaxed last:pr-0 ${
                    i === 0 ? 'text-text' : 'text-body'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function LegalPage({ type }: LegalPageProps) {
  const doc: LegalDocument = type === 'privacy' ? privacyPolicy : termsOfUse
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    // Reset when switching between the two documents: the previous page's
    // highlighted section id means nothing here.
    setActiveSection('')
    // Only jump to the top when the URL is not asking for a specific section.
    // Someone arriving on /privacy#cookies wants the cookies section, and
    // scrolling them to the top would throw away the reason they followed the
    // link — the browser cannot restore it once React has replaced the page.
    const target = window.location.hash ? document.querySelector(window.location.hash) : null
    if (target) {
      target.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [type])

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + 160
      let current = ''
      for (const section of doc.sections) {
        const el = document.getElementById(section.id)
        if (el && el.offsetTop <= line) current = section.id
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [doc])

  return (
    <div className="bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-xs text-muted-2" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-body">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-body">{doc.title}</span>
          </nav>

          <h1 className="t-h1 mt-6 font-display text-text">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-muted-2">Version: {doc.version}</p>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-body">{doc.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              to="/privacy"
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                type === 'privacy'
                  ? 'border-brand/40 bg-brand/10 text-brand'
                  : 'border-line text-body hover:text-text'
              }`}
            >
              Privacy policy
            </Link>
            <Link
              to="/terms"
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                type === 'terms'
                  ? 'border-brand/40 bg-brand/10 text-brand'
                  : 'border-line text-body hover:text-text'
              }`}
            >
              Terms of use
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-body transition-colors hover:text-text print:hidden"
            >
              <Printer className="size-4" aria-hidden="true" />
              Print
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:flex lg:gap-16 lg:px-8 lg:py-20">
        <nav
          aria-label="On this page"
          className="mb-12 shrink-0 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:w-60 print:hidden"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-muted-2">On this page</p>
          <ul className="flex flex-col gap-2.5">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`block text-sm leading-snug transition-colors ${
                    activeSection === section.id
                      ? 'text-brand'
                      : 'text-muted-2 hover:text-body'
                  }`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 border-b border-line pb-10">
            {doc.intro.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {doc.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              // Clears the sticky header when a table-of-contents link jumps here.
              className="scroll-mt-24 border-b border-line py-10 last:border-b-0"
            >
              <h2 className="mb-5 font-display text-xl font-medium text-text sm:text-2xl">
                {section.title}
              </h2>
              <div className="flex flex-col gap-4">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
