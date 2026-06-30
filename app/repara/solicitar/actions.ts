'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface RepairRequestParams {
  device_type: string
  device_brand: string
  device_model: string
  issue_category: string
  issue_description: string
  service_mode: string
  customer_name: string
  customer_phone: string
  address: string
  user_id: string | null
}

export async function submitRepairRequest(params: RepairRequestParams) {
  const supabase = await createSupabaseServer()

  const { data: ticket, error } = await supabase
    .from('repara_bookings')
    .insert({
      device: params.device_type,
      brand: params.device_brand,
      model: params.device_model,
      issue: params.issue_category,
      description: params.issue_description,
      service_mode: params.service_mode,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      address: params.address,
      status: 'pending',
      user_id: params.user_id,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message, ticketId: null }
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
          type: 'repara',
          message: `🔧 Nueva solicitud de reparación\nCliente: ${params.customer_name}\nTel: ${params.customer_phone}\nDispositivo: ${params.device_brand} ${params.device_model} (${params.device_type})\nProblema: ${params.issue_category}\nModo: ${params.service_mode === 'pickup_delivery' ? 'Recogida a domicilio' : 'En taller'}`,
        }),
      }).catch(() => {})
    }
  } catch {}

  // Notify customer in-app
  if (params.user_id) {
    try {
      await supabase.from('user_notifications').insert({
        user_id: params.user_id,
        type: 'repair',
        title: 'Solicitud de reparación recibida',
        body: `Tu solicitud para ${params.device_brand} ${params.device_model} ha sido recibida. Te contactaremos pronto.`,
        metadata: { ticket_id: ticket.id },
        read: false,
      })
    } catch {}
  }

  // If pickup_delivery mode → auto-create a Lleva request for device pickup
  if (params.service_mode === 'pickup_delivery' && params.address) {
    try {
      await supabase.from('lleva_requests').insert({
        pickup_address: params.address,
        dropoff_address: 'Taller Telo\' Repara — Santo Domingo',
        package_description: `Dispositivo para reparación: ${params.device_brand} ${params.device_model} (Ticket #${ticket.id.slice(0, 8)})`,
        vehicle_type: 'motorcycle',
        service_type: 'standard',
        estimated_fare: 250,
        customer_name: params.customer_name,
        customer_phone: params.customer_phone,
        pickup_contact: params.customer_phone,
        dropoff_contact: '8099038707',
        status: 'pending',
        user_id: params.user_id,
      })
    } catch {}
  }

  return { error: null, ticketId: ticket.id }
}
