import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'

export const metadata = { title: 'Mi Perfil' }

export default async function ProfilePage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch user profile from user_profiles table
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <ProfileForm
        userId={user.id}
        email={user.email || ''}
        initialData={{
          full_name: profile?.full_name || user.user_metadata?.full_name || '',
          phone: profile?.phone || user.user_metadata?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          avatar_url: profile?.avatar_url || '',
        }}
      />
    </main>
  )
}
