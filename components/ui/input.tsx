'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--c-text)]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-lg)] text-sm text-[var(--c-text)] placeholder:text-[var(--c-text-dim)]',
            'transition-colors duration-150',
            'hover:border-[var(--c-border-hover)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--c-info)] focus:border-transparent',
            error && 'border-[var(--c-danger)] focus:ring-[var(--c-danger)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--c-danger)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--c-text-dim)]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
