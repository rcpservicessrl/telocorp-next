import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

/**
 * Admin layout — only accessible by users with admin/org roles.
 * The middleware already redirects unauthenticated users.
 * This additionally checks for admin privileges.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/admin')

  // Check admin status: email @telocg.com OR role=admin in metadata
  const isAdmin = user.email?.endsWith('@telocg.com') ||
    user.user_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'owner'

  if (!isAdmin) redirect('/dashboard')

  // Get user's accessible modules (default: all for @telocg.com)
  const modules = user.user_metadata?.modules as string[] | undefined

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <AdminSidebar userEmail={user.email || ''} modules={modules} />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
