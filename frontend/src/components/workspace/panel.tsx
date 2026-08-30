import type { ReactNode } from 'react'

/**
 * Standard loading/error/empty/content states for a workspace section, so
 * every table on every page fails and loads the same way instead of each
 * page inventing its own placeholder.
 */
export function Panel({
  title,
  description,
  loading,
  error,
  empty,
  emptyLabel = 'Nothing here yet.',
  children,
}: {
  title: string
  description?: string
  loading: boolean
  error: unknown
  empty: boolean
  emptyLabel?: string
  children: ReactNode
}) {
  return (
    <section className="flat-card p-6 lg:p-7">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
        {description ? <p className="text-sm text-body">{description}</p> : null}
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[4px] bg-ink-3" aria-label="Loading" />
      ) : error ? (
        <p className="rounded-[4px] border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          Could not load this data. Check your connection and try again.
        </p>
      ) : empty ? (
        <p className="rounded-[4px] border border-line-soft bg-ink-3 px-4 py-6 text-center text-sm text-muted-2">
          {emptyLabel}
        </p>
      ) : (
        children
      )}
    </section>
  )
}
