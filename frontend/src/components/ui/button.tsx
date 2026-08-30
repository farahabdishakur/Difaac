import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-[4px] font-medium whitespace-nowrap transition-all duration-200 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand/60 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-brand text-brand-ink font-semibold border border-brand hover:bg-brand-bright hover:border-brand-bright transition-colors',
        outline:
          'border border-brand/50 bg-ink-2 text-text hover:bg-brand/10 hover:border-brand hover:text-brand transition-colors',
        secondary:
          'bg-ink-3 text-text border border-line hover:border-brand/60 hover:text-brand hover:bg-line transition-colors',
        ghost:
          'hover:bg-white/5 hover:text-brand aria-expanded:bg-white/5 aria-expanded:text-foreground text-body transition-colors',
        cyber:
          'bg-brand text-brand-ink font-bold border border-brand hover:bg-brand-bright transition-colors',
        destructive:
          'bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 focus-visible:ring-destructive/40',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: 'h-6 gap-1 rounded-[3px] px-2 text-xs in-data-[slot=button-group]:rounded-[3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*=\'size-\'])]:size-3',
        sm: 'h-8 gap-1.5 rounded-[3px] px-3.5 text-xs in-data-[slot=button-group]:rounded-[3px] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*=\'size-\'])]:size-3.5',
        lg: 'h-11 gap-2.5 px-6 text-sm font-semibold has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-10 rounded-[4px]',
        'icon-xs': 'size-6 rounded-[3px] [&_svg:not([class*=\'size-\'])]:size-3',
        'icon-sm': 'size-8 rounded-[3px]',
        'icon-lg': 'size-11 rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }


