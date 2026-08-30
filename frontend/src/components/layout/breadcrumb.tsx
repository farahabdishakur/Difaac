import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

type Crumb = {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link to={item.href} className="link-underline text-body hover:text-text">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-text' : 'text-body'}>
                {item.label}
              </span>
            )}
            {!isLast ? <ChevronRight className="size-3.5 text-muted-2" aria-hidden="true" /> : null}
          </span>
        )
      })}
    </nav>
  )
}
