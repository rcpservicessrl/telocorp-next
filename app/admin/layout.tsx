import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

/**
 * Admin layout — completely separate from client.
 * No Header, no Footer, no ChatWidget from client side.
 * The middleware handles redirects for unauthenticated users.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  // No user → only /admin/login is accessible (middleware handles redirect)
  // But if somehow they get here without auth, show children (login page)
  if (!user) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }

  // Check admin status
  const isAdmin = user.email?.endsWith('@telocg.com') ||
    user.user_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'owner'

  if (!isAdmin) redirect('/dashboard')

  const modules = user.user_metadata?.modules as string[] | undefined

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={user.email || ''} modules={modules} />
      <main className="flex-1 p-6 overflow-auto">
        {/* Admin topbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-3">
            <img src="/assets/telocorpgroup-mark.png" alt="" className="h-7 w-7 rounded-lg" />
            <span className="text-sm font-medium text-[var(--c-text-muted)]">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--c-text-dim)]">
            <span>{user.email}</span>
            <a href="/" target="_blank" className="text-xs text-[var(--c-info)] hover:underline">Ver sitio →</a>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
