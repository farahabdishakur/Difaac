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
    'bg-gradient-to-br from-brand to-brand text-brand-ink font-semibold border border-brand/80 shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 hover:border-brand hover:from-brand-bright hover:to-brand-bright transition-all duration-300',
  cyber:
    'bg-gradient-to-br from-brand to-brand text-brand-ink font-bold border border-brand/80 shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 hover:from-brand-bright hover:to-brand-bright transition-all duration-300',
  secondary:
    'border border-brand/30 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-md text-text hover:border-brand/50 hover:from-brand/10 hover:to-white/[0.06] hover:shadow-lg hover:shadow-brand/10 transition-all duration-300',
  outline:
    'border border-brand/40 bg-gradient-to-br from-brand/5 to-white/[0.02] backdrop-blur-md text-text hover:from-brand/10 hover:to-brand/5 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10 hover:text-brand transition-all duration-300',
  ghost:
    'border border-transparent bg-transparent text-body hover:text-brand hover:bg-white/10 hover:border-brand/20 transition-all duration-300',
}

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-5 text-sm',
  lg: 'h-13 px-8 text-base font-semibold',
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


