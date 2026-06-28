import { createSupabaseServer } from '@/lib/supabase-server'
import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ certId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { certId } = await params
  return {
    title: `Verificar Certificado — ${certId}`,
    description: `Verificación pública de certificado ${BRAND.educa}`,
  }
}

export default async function VerifyCertPage({ params }: Props) {
  const { certId } = await params
  const supabase = await createSupabaseServer()

  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', certId)
    .single()

  if (!cert) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">❌</p>
        <h1 className="text-2xl font-bold mb-2">Certificado no encontrado</h1>
        <p className="text-[var(--c-text-muted)]">
          El código <code className="bg-[var(--c-surface-2)] px-2 py-0.5 rounded text-sm">{certId}</code> no corresponde a ningún certificado válido.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <p className="text-5xl mb-4">🎓</p>
        <h1 className="text-2xl font-bold">Certificado Verificado</h1>
        <Badge variant="success" className="mt-2">✓ Auténtico</Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div className="text-center border-b border-[var(--c-border)] pb-4">
          <p className="text-sm text-[var(--c-text-dim)]">{BRAND.educa}</p>
          <h2 className="text-lg font-bold mt-1">{cert.course_title || 'Curso Completado'}</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--c-text-dim)]">Estudiante:</span>
            <span className="font-medium">{cert.student_name || cert.user_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--c-text-dim)]">Puntuación:</span>
            <span className="font-medium">{cert.score || cert.quiz_score || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--c-text-dim)]">Fecha emisión:</span>
            <span className="font-medium">
              {new Date(cert.issued_at || cert.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--c-text-dim)]">ID Certificado:</span>
            <code className="text-xs bg-[var(--c-surface-2)] px-2 py-0.5 rounded">{certId.slice(0, 12)}</code>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--c-border)] text-center">
          <p className="text-xs text-[var(--c-text-dim)]">
            Este certificado fue emitido por {BRAND.group} y puede ser verificado en esta URL.
          </p>
        </div>
      </Card>
    </main>
  )
}
