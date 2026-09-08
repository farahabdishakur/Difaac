import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: React.ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        action ? 'sm:flex-row sm:items-end sm:justify-between sm:text-left' : '',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'center' && !action ? 'items-center' : '')}>
        {eyebrow ? (
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">{eyebrow}</span>
        ) : null}
        <h2 className="text-balance font-display font-medium text-text t-h1">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-pretty leading-relaxed text-body">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
