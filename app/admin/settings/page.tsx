import { createSupabaseServer } from '@/lib/supabase-server'
import { SettingsForm } from './settings-form'

export const metadata = { title: 'Admin — Configuración' }

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServer()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración del Sitio</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
