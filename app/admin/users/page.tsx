import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InviteUserForm } from './invite-form'

export const metadata = { title: 'Admin — Usuarios' }

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServer()

  const { data: members } = await supabase
    .from('org_members')
    .select('*')
    .order('joined_at', { ascending: false })

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(30)

  const roleVariant = (role: string) => {
    if (role === 'owner') return 'danger' as const
    if (role === 'admin') return 'warning' as const
    if (role === 'manager') return 'info' as const
    return 'default' as const
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-[var(--c-text-muted)]">{profiles?.length || 0} registrados</p>
        </div>
      </div>

      {/* Invite form */}
      <InviteUserForm />

      {/* Members with roles */}
      {members && members.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm mb-3">Equipo (con rol asignado)</h2>
          <div className="space-y-2">
            {members.map((m) => (
              <Card key={m.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{m.user_id?.slice(0, 8)}</p>
                  <p className="text-xs text-[var(--c-text-dim)]">
                    Módulos: {m.modules?.length ? m.modules.join(', ') : 'Todos'}
                  </p>
                </div>
                <Badge variant={roleVariant(m.role)}>{m.role}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All profiles */}
      <h2 className="font-semibold text-sm mb-3">Clientes registrados</h2>
      <div className="space-y-2">
        {(profiles || []).map((p) => (
          <Card key={p.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{p.full_name || 'Sin nombre'}</p>
              <p className="text-xs text-[var(--c-text-dim)]">{p.phone || 'Sin teléfono'} · {p.city || 'Sin ciudad'}</p>
            </div>
            <div className="text-right">
              <Badge variant={p.loyalty_tier === 'gold' ? 'warning' : p.loyalty_tier === 'platinum' ? 'info' : 'default'}>
                {p.loyalty_tier || 'bronze'}
              </Badge>
              <p className="text-xs text-[var(--c-text-dim)] mt-1">{p.loyalty_points || 0} pts</p>
            </div>
          </Card>
        ))}

        {(!profiles || profiles.length === 0) && (
          <p className="text-center py-8 text-[var(--c-text-muted)]">Sin usuarios registrados.</p>
        )}
      </div>
    </div>
  )
}
