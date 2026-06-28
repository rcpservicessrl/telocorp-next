import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-[var(--c-surface-2)] text-[var(--c-text-muted)]',
        success: 'bg-green-500/10 text-green-400',
        warning: 'bg-yellow-500/10 text-yellow-400',
        danger: 'bg-red-500/10 text-red-400',
        info: 'bg-blue-500/10 text-blue-400',
        sales: 'bg-orange-500/10 text-orange-400',
        educa: 'bg-violet-500/10 text-violet-400',
        lleva: 'bg-amber-500/10 text-amber-400',
        repara: 'bg-purple-500/10 text-purple-400',
        instala: 'bg-emerald-500/10 text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
