import { Link } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'to'> & {
  href: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'cyber'
  size?: 'default' | 'lg' | 'sm' | 'xs'
  className?: string
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-brand text-brand-ink font-semibold border border-brand hover:bg-brand-bright hover:border-brand-bright transition-colors',
  cyber:
    'bg-brand text-brand-ink font-bold border border-brand hover:bg-brand-bright transition-colors',
  secondary:
    'border border-line bg-ink-3 text-text hover:border-brand/60 hover:text-brand hover:bg-line transition-colors',
  outline:
    'border border-brand/50 bg-ink-2 text-text hover:bg-brand/10 hover:border-brand hover:text-brand transition-colors',
  ghost:
    'border border-transparent bg-transparent text-body hover:text-brand hover:bg-white/5 transition-colors',
}

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-sm font-semibold',
  sm: 'h-8 px-3.5 text-xs',
  xs: 'h-6 px-2 text-xs',
}

export function LinkButton({
  variant = 'primary',
  size = 'default',
  className,
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      render={<Link to={href} {...props} />}
      nativeButton={false}
      className={cn(
        'rounded-[4px] font-medium tracking-normal transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Button>
  )
}


