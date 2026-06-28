import Link from 'next/link'
import { VERTICALS, type Vertical } from '@/lib/utils'

interface ServiceSuggestionProps {
  /** Current vertical the user is on — will be excluded from suggestions */
  current: Vertical
  /** Optional context for smarter suggestions */
  context?: 'post_purchase' | 'post_repair' | 'post_install' | 'post_delivery'
}

const SUGGESTIONS: Record<string, { vertical: Vertical; message: string }[]> = {
  post_purchase: [
    { vertical: 'instala', message: '¿Necesitas instalación profesional para tu compra?' },
    { vertical: 'lleva', message: '¿Enviar a otra dirección? Usa nuestro servicio express.' },
  ],
  post_repair: [
    { vertical: 'sales', message: '¿Buscas un reemplazo? Mira nuestra tienda.' },
    { vertical: 'instala', message: '¿Necesitas reinstalar el equipo reparado?' },
  ],
  post_install: [
    { vertical: 'educa', message: 'Aprende a sacar el máximo provecho de tu equipo.' },
    { vertical: 'repara', message: '¿Problemas con otro dispositivo? Estamos para ayudarte.' },
  ],
  post_delivery: [
    { vertical: 'repara', message: '¿Tu dispositivo necesita reparación?' },
    { vertical: 'instala', message: '¿Necesitas instalar lo que recibiste?' },
  ],
}

export function ServiceSuggestion({ current, context }: ServiceSuggestionProps) {
  const suggestions = context
    ? SUGGESTIONS[context]?.filter(s => s.vertical !== current)
    : Object.entries(VERTICALS)
        .filter(([key]) => key !== current)
        .slice(0, 2)
        .map(([key, v]) => ({ vertical: key as Vertical, message: v.description }))

  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-8 p-5 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)]">
      <h3 className="text-sm font-semibold mb-3">También te puede interesar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s) => {
          const v = VERTICALS[s.vertical]
          return (
            <Link
              key={s.vertical}
              href={v.href}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors"
            >
              <span className="text-xl">{v.icon}</span>
              <div>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="text-xs text-[var(--c-text-dim)]">{s.message}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
