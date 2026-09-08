import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Resource } from '@/lib/data/resources'

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group flex h-full flex-col justify-between gap-5 rounded-[4px] border border-line bg-ink-2 p-6 lg:p-7 transition-all duration-200 hover:border-brand/60 hover:bg-ink-3"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="rounded-[2px] border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-brand">
            {resource.type}
          </span>
          {resource.isNew ? (
            <span className="rounded-[2px] bg-brand px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wide text-brand-ink">
              NEW
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-display text-base sm:text-lg font-medium leading-snug text-text group-hover:text-brand transition-colors">
            {resource.title}
          </h3>
          <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-body">{resource.excerpt}</p>
        </div>
      </div>

      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-medium text-brand transition-colors group-hover:text-brand-bright">
        <span>Read Intelligence Bulletin</span>
        <ArrowRight
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}


