'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface DeliveryRequestParams {
  pickup_address: string
  dropoff_address: string
  package_description: string
  vehicle_type: string
  service_type: string
  estimated_fare: number
  customer_name: string
  customer_phone: string
  pickup_contact: string
  dropoff_contact: string
  user_id: string | null
}

export async function submitDeliveryRequest(params: DeliveryRequestParams) {
  const supabase = await createSupabaseServer()

  const { data: request, error } = await supabase
    .from('lleva_requests')
    .insert({
      pickup_address: params.pickup_address,
      dropoff_address: params.dropoff_address,
      package_description: params.package_description,
      vehicle_type: params.vehicle_type,
      service_type: params.service_type,
      estimated_fare: params.estimated_fare,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      pickup_contact: params.pickup_contact,
      dropoff_contact: params.dropoff_contact,
      status: 'pending',
      user_id: params.user_id,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message, requestId: null }
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
          type: 'lleva',
          message: `📦 Nueva solicitud de envío\nCliente: ${params.customer_name}\nTel: ${params.customer_phone}\nRecogida: ${params.pickup_address}\nEntrega: ${params.dropoff_address}\nVehículo: ${params.vehicle_type}\nTipo: ${params.service_type}\nEstimado: RD$ ${params.estimated_fare.toLocaleString()}`,
        }),
      }).catch(() => {})
    }
  } catch {}

  // Notify customer
  if (params.user_id) {
    try {
      await supabase.from('user_notifications').insert({
        user_id: params.user_id,
        type: 'delivery',
        title: 'Envío solicitado',
        body: `Tu solicitud de envío ha sido recibida. Estamos buscando un conductor disponible.`,
        metadata: { request_id: request.id },
        read: false,
      })
    } catch {}
  }

  return { error: null, requestId: request.id }
}
