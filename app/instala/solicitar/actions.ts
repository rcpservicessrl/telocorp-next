'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface InstalaBookingParams {
  service_id: string
  service_name: string
  description: string
  preferred_date: string
  preferred_time: string
  customer_name: string
  customer_phone: string
  address: string
  access_instructions: string
  estimated_cost: number
  user_id: string | null
}

export async function submitInstalaBooking(params: InstalaBookingParams) {
  const supabase = await createSupabaseServer()

  const { data: booking, error } = await supabase
    .from('instala_bookings')
    .insert({
      service: params.service_id,
      service_name: params.service_name,
      description: params.description,
      preferred_date: params.preferred_date || null,
      preferred_time: params.preferred_time || null,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      address: params.address,
      access_instructions: params.access_instructions,
      estimated_cost: params.estimated_cost,
      status: 'pending',
      user_id: params.user_id,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message, bookingId: null }
  }

  // Notify admin
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/functions/v1/notify-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          type: 'instala',
          message: `🛠️ Nueva solicitud de instalación\nServicio: ${params.service_name}\nCliente: ${params.customer_name}\nTel: ${params.customer_phone}\nDirección: ${params.address}\nFecha: ${params.preferred_date || 'Por confirmar'}\nHorario: ${params.preferred_time || 'Por confirmar'}\nEstimado: RD$ ${params.estimated_cost.toLocaleString()}`,
        }),
      }).catch(() => {})
    }
  } catch {}

  // Notify customer
  if (params.user_id) {
    try {
      await supabase.from('user_notifications').insert({
        user_id: params.user_id,
        type: 'install',
        title: 'Servicio agendado',
        body: `Tu solicitud de ${params.service_name} ha sido recibida. Te confirmaremos fecha y técnico asignado.`,
        metadata: { booking_id: booking.id },
        read: false,
      })
    } catch {}
  }

  return { error: null, bookingId: booking.id }
}
