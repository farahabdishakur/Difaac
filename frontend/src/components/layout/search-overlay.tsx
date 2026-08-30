
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { popularSearches } from '@/lib/data/nav'
import { products } from '@/lib/data/products'
import { solutions } from '@/lib/data/solutions'
import { resources, blogPosts } from '@/lib/data/resources'

type ResultItem = { slug: string; name?: string; title?: string }

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.trim().toLowerCase()
    return {
      Products: products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4) as ResultItem[],
      Solutions: solutions.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 4) as ResultItem[],
      Resources: resources.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 4) as ResultItem[],
      Blog: blogPosts.filter((b) => b.title.toLowerCase().includes(q)).slice(0, 4) as ResultItem[],
    }
  }, [query])

  const hasResults = results && Object.values(results).some((list) => list.length > 0)

  function hrefFor(category: string, slug: string) {
    if (category === 'Products') return `/products/${slug}`
    if (category === 'Solutions') return `/solutions/${slug}`
    if (category === 'Blog') return `/blog/${slug}`
    return `/resources/${slug}`
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setQuery('')
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/97 backdrop-blur-md transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col overflow-y-auto border-none bg-transparent p-0 outline-none transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          <DialogPrimitive.Title className="sr-only">Search Difaac</DialogPrimitive.Title>
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-16 sm:px-6">
            <div className="flex items-center justify-end">
              <DialogPrimitive.Close render={<Button variant="ghost" size="icon" aria-label="Close search" />}>
                <X className="size-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <div className="flex items-center gap-3 rounded-none border border-line bg-ink-3 px-5 py-4">
              <Search className="size-5 shrink-0 text-muted-2" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">
                Search Difaac
              </label>
              <input
                id="site-search"
                type="text"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, solutions, resources..."
                className="w-full bg-transparent text-lg text-text placeholder:text-muted-2 focus:outline-none"
              />
            </div>

            {!query.trim() ? (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">Popular searches</span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="rounded-none border border-line-soft bg-ink-3 px-4 py-1.5 text-sm text-body transition-colors hover:border-brand/40 hover:text-text"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : hasResults ? (
              <div className="flex flex-col gap-8">
                {Object.entries(results ?? {}).map(([category, items]) =>
                  items.length > 0 ? (
                    <div key={category} className="flex flex-col gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">{category}</span>
                      <ul className="flex flex-col gap-1">
                        {items.map((item) => (
                          <li key={item.slug}>
                            <Link
                              to={hrefFor(category, item.slug)}
                              onClick={() => onOpenChange(false)}
                              className="block rounded-none px-3 py-2 text-base text-text transition-colors hover:bg-ink-3"
                            >
                              {item.name ?? item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null,
                )}
              </div>
            ) : (
              <p className="text-body">No results for &ldquo;{query}&rdquo;.</p>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
