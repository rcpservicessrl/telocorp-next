'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (!user || !supabase) return

    // Fetch recent notifications
    supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setNotifications(data as Notification[])
      })
  }, [user])

  const markAsRead = async (id: string) => {
    if (!supabase) return
    await supabase.from('user_notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    if (!supabase || !user) return
    await supabase.from('user_notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--c-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--c-border)]">
              <h3 className="font-semibold text-sm">Notificaciones</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-[var(--c-info)] hover:underline">
                  Marcar todas leídas
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-center text-[var(--c-text-muted)]">
                Sin notificaciones
              </p>
            ) : (
              <div>
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-colors ${!n.read ? 'bg-[var(--c-surface-2)]/50' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--c-info)] shrink-0" />}
                      <div className={!n.read ? '' : 'pl-4'}>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-[var(--c-text-muted)] line-clamp-2">{n.body}</p>
                        <time className="text-xs text-[var(--c-text-dim)] mt-1 block">
                          {new Date(n.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-xs text-[var(--c-info)] hover:bg-[var(--c-surface-2)] transition-colors"
            >
              Ver todas
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
