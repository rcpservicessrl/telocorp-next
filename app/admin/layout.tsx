import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { AdminSidebar } from '@/components/admin/sidebar'

/**
 * Admin layout — only accessible by users with admin/org roles.
 * The /admin/login page bypasses this via middleware (no user required).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if this is the login page — if so, render without sidebar
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, the only admin page accessible is /admin/login
  if (!user) {
    return <>{children}</>
  }

  // Check admin status
  const isAdmin = user.email?.endsWith('@telocg.com') ||
    user.user_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'owner'

  if (!isAdmin) redirect('/dashboard')

  // Get user's accessible modules
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
