'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { BRAND } from '@/lib/utils'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface Suggestion {
  icon: string
  title: string
  message: string
  action: string
  href: string
}

/**
 * AI-powered smart suggestions based on user activity.
 * Shows contextual recommendations in the dashboard.
 */
export function SmartSuggestions() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    if (!user || !supabase) return

    generateSuggestions(user.id).then(setSuggestions)
  }, [user])

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-[var(--c-educa)]" />
        <h3 className="text-sm font-semibold">Sugerencias para ti</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s, i) => (
          <Link key={i} href={s.href}>
            <Card hover className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-[var(--c-text-muted)] mt-0.5">{s.message}</p>
                  <p className="text-xs text-[var(--c-info)] mt-1">{s.action} →</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function generateSuggestions(userId: string): Promise<Suggestion[]> {
  if (!supabase) return []
  const suggestions: Suggestion[] = []

  // Check if user has any orders
  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, items')
    .order('created_at', { ascending: false })
    .limit(3)

  // Check if user has any bookings
  const { data: repairs } = await supabase
    .from('repara_bookings')
    .select('id, status, created_at')
    .eq('user_id', userId)
    .limit(1)

  // No orders yet → suggest shopping
  if (!orders || orders.length === 0) {
    suggestions.push({
      icon: '🛒',
      title: 'Explora la tienda',
      message: 'Tenemos tecnología y accesorios con envío express.',
      action: 'Ver productos',
      href: '/products',
    })
  }

  // Has orders → suggest education
  if (orders && orders.length > 0) {
    suggestions.push({
      icon: '🎓',
      title: 'Aprende más',
      message: 'Cursos gratuitos sobre tecnología y reparación.',
      action: 'Ver cursos',
      href: '/educa',
    })
  }

  // No repairs → suggest if they might need one
  if (!repairs || repairs.length === 0) {
    suggestions.push({
      icon: '🔧',
      title: '¿Equipo dañado?',
      message: 'Repara tu celular, laptop o TV con garantía.',
      action: 'Solicitar reparación',
      href: '/repara/solicitar',
    })
  }

  // Always suggest installation services
  suggestions.push({
    icon: '🛠️',
    title: `${BRAND.instala}`,
    message: 'TV, A/C, cámaras — instalación profesional.',
    action: 'Agendar servicio',
    href: '/instala/solicitar',
  })

  return suggestions.slice(0, 4)
}
