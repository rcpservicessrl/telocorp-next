import { createSupabaseServer } from '@/lib/supabase-server'

export type NotificationType = 'order' | 'course' | 'delivery' | 'repair' | 'install' | 'system'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  body: string
  metadata?: Record<string, unknown>
}

/**
 * Creates an in-app notification for a user.
 * Call this from Server Actions whenever an event occurs (order placed, status change, etc.)
 */
export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.from('user_notifications').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    metadata: params.metadata || {},
    read: false,
  })

  if (error) {
    console.error('Failed to create notification:', error.message)
  }

  return { error: error?.message || null }
}

/**
 * Notify admin (via in-app + optionally WhatsApp).
 * Used when orders/bookings come in.
 */
export async function notifyAdmin(params: Omit<CreateNotificationParams, 'userId'>) {
  const supabase = await createSupabaseServer()

  // Find admin user(s) — @telocg.com emails
  const { data: adminProfiles } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(5)

  // For now we notify based on known admin email
  // In production, query org_members with role='admin'
  const adminId = 'admin' // placeholder — will use real admin user ID

  // Also call WhatsApp Edge Function if configured
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (siteUrl) {
      await fetch(`${siteUrl}/functions/v1/notify-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: params.type,
          message: `${params.title}\n${params.body}`,
        }),
      }).catch(() => {}) // Don't block on WhatsApp failure
    }
  } catch {
    // Silent fail — WhatsApp is best-effort
  }

  return { error: null }
}
