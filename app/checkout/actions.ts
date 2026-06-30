'use server'

import { createSupabaseServer } from '@/lib/supabase-server'

interface PlaceOrderParams {
  items: { id: string; title: string; qty: number; price: number }[]
  customer: { name: string; phone: string; email: string; address: string; city: string }
  subtotal: number
  discount: number
  coupon: string | null
  shipping: number
  total: number
  payment_method: string
  user_id: string | null
}

export async function placeOrder(params: PlaceOrderParams) {
  const supabase = await createSupabaseServer()

  // Insert the order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      items: params.items,
      customer: params.customer,
      subtotal: params.subtotal,
      shipping: params.shipping,
      discount: params.discount,
      coupon: params.coupon,
      total: params.total,
      payment_method: params.payment_method,
      status: 'pending',
      notes: '',
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message, orderId: null }
  }

  // Reduce stock for each item
  for (const item of params.items) {
    try {
      await supabase.rpc('decrement_stock', { product_id: item.id, qty: item.qty })
    } catch {}
  }

  // Notify admin via WhatsApp
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      const itemsList = params.items.map(i => `- ${i.title} x${i.qty}`).join('\n')
      await fetch(`${supabaseUrl}/functions/v1/notify-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          type: 'order',
          message: `🛒 Nueva orden #${order.id.slice(0, 8)}\nCliente: ${params.customer.name}\nTel: ${params.customer.phone}\nTotal: RD$ ${params.total.toLocaleString()}\nPago: ${params.payment_method}\n\nProductos:\n${itemsList}`,
        }),
      }).catch(() => {})
    }
  } catch {}

  // Create notification for the customer if logged in
  if (params.user_id) {
    try {
      await supabase.from('user_notifications').insert({
        user_id: params.user_id,
        type: 'order',
        title: 'Pedido confirmado',
        body: `Tu orden #${order.id.slice(0, 8)} ha sido recibida. Total: RD$ ${params.total.toLocaleString()}`,
        metadata: { order_id: order.id },
        read: false,
      })
    } catch {}
  }

  return { error: null, orderId: order.id }
}
