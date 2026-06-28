import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { code, subtotal } = await request.json()

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ valid: false, error: 'Código requerido' })
  }

  const supabase = await createSupabaseServer()

  // Get site settings with coupons
  const { data: settings } = await supabase
    .from('site_settings')
    .select('coupons')
    .single()

  const coupons = (settings?.coupons || {}) as Record<string, number>
  const normalizedCode = code.trim().toUpperCase()

  if (!(normalizedCode in coupons)) {
    return NextResponse.json({ valid: false, error: 'Cupón no válido' })
  }

  const discountPercent = coupons[normalizedCode]
  const discountAmount = Math.round((subtotal || 0) * (discountPercent / 100))

  return NextResponse.json({
    valid: true,
    code: normalizedCode,
    discount_percent: discountPercent,
    discount_amount: discountAmount,
  })
}
