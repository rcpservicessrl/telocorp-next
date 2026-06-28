'use client'

import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
  metadata?: Record<string, unknown>
}

const TYPE_LABELS: Record<string, { label: string; variant: 'sales' | 'educa' | 'lleva' | 'repara' | 'instala' | 'info' }> = {
  order: { label: "Telo' Sales", variant: 'sales' },
  course: { label: "Telo' Educa", variant: 'educa' },
  delivery: { label: "Telo' Lleva", variant: 'lleva' },
  repair: { label: "Telo' Repara", variant: 'repara' },
  install: { label: "Telo' Instala", variant: 'instala' },
  system: { label: 'Sistema', variant: 'info' },
}

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--c-text-muted)]">
        <p className="text-4xl mb-3">🔔</p>
        <p>No tienes notificaciones</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => {
        const typeInfo = TYPE_LABELS[n.type] || TYPE_LABELS.system

        return (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-colors ${
              n.read
                ? 'bg-[var(--c-surface)] border-[var(--c-border)]'
                : 'bg-[var(--c-surface-2)] border-[var(--c-border-hover)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--c-info)]" />}
                </div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-[var(--c-text-muted)] mt-0.5">{n.body}</p>
              </div>
              <time className="text-xs text-[var(--c-text-dim)] shrink-0">
                {new Date(n.created_at).toLocaleDateString('es-DO', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>
        )
      })}
    </div>
  )
}
