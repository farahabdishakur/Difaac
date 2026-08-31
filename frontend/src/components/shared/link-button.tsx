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
    'bg-brand text-brand-ink font-semibold border border-brand hover:bg-brand-bright hover:border-brand-bright shadow-lg hover:shadow-xl transition-all duration-200',
  cyber:
    'bg-brand text-brand-ink font-bold border border-brand hover:bg-brand-bright shadow-lg hover:shadow-xl transition-all duration-200',
  secondary:
    'border border-line/60 bg-white/[0.04] backdrop-blur-sm text-text hover:border-brand/50 hover:text-text hover:bg-white/[0.08] transition-all duration-200',
  outline:
    'border border-brand/40 bg-white/[0.02] backdrop-blur-sm text-text hover:bg-brand/5 hover:border-brand/70 hover:text-brand transition-all duration-200',
  ghost:
    'border border-transparent bg-transparent text-body hover:text-brand hover:bg-white/5 transition-all duration-200',
}

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base font-semibold',
  sm: 'h-9 px-4 text-sm',
  xs: 'h-7 px-2.5 text-xs',
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
        'rounded-lg font-medium tracking-normal transition-all duration-200 inline-flex items-center gap-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Button>
  )
}


