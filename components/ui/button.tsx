'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-info)]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--c-primary)] text-white hover:opacity-90 active:scale-[0.98]',
        sales: 'bg-[var(--c-sales)] text-white hover:opacity-90 active:scale-[0.98]',
        educa: 'bg-[var(--c-educa)] text-white hover:opacity-90 active:scale-[0.98]',
        lleva: 'bg-[var(--c-lleva)] text-white hover:opacity-90 active:scale-[0.98]',
        repara: 'bg-[var(--c-repara)] text-white hover:opacity-90 active:scale-[0.98]',
        instala: 'bg-[var(--c-instala)] text-white hover:opacity-90 active:scale-[0.98]',
        secondary: 'bg-[var(--c-surface-2)] text-[var(--c-text)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] hover:bg-[var(--c-surface-3)]',
        ghost: 'text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-2)]',
        danger: 'bg-[var(--c-danger)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-[var(--radius-md)]',
        md: 'h-10 px-4 text-sm rounded-[var(--radius-lg)]',
        lg: 'h-12 px-6 text-base rounded-[var(--radius-xl)]',
        icon: 'h-10 w-10 rounded-[var(--radius-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
