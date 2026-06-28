import { createSupabaseServer } from '@/lib/supabase-server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = { title: 'Admin — Organizaciones' }

export default async function AdminOrganizationsPage() {
  const supabase = await createSupabaseServer()

  const { data: orgs } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Organizaciones</h1>
          <p className="text-sm text-[var(--c-text-muted)]">Empresas vinculadas al ecosistema</p>
        </div>
        <Link href="/admin/organizations/new">
          <Button size="sm">+ Nueva Organización</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {(orgs || []).map((org) => (
          <Card key={org.id} hover className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--c-surface-2)] flex items-center justify-center text-lg">
                  {org.logo_url ? (
                    <img src={org.logo_url} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    '🏢'
                  )}
                </div>
                <div>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-xs text-[var(--c-text-dim)]">/{org.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {(org.modules || []).map((mod: string) => (
                    <Badge key={mod} variant="default" className="text-[10px]">{mod}</Badge>
                  ))}
                </div>
                <Badge variant={org.active ? 'success' : 'danger'}>
                  {org.plan}
                </Badge>
              </div>
            </div>
          </Card>
        ))}

        {(!orgs || orgs.length === 0) && (
          <div className="text-center py-10 text-[var(--c-text-muted)]">
            <p>Sin organizaciones. La org principal se crea con la migración SQL.</p>
          </div>
        )}
      </div>
    </div>
  )
}
