import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[var(--radius-xl)] p-4',
        hover && 'transition-all duration-150 hover:border-[var(--c-border-hover)] hover:shadow-[var(--shadow-md)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pb-3 border-b border-[var(--c-border)]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-3', className)} {...props}>
      {children}
    </div>
  )
}
