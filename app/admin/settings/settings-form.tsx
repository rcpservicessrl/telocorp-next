'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { saveSettings } from './actions'

interface SettingsFormProps {
  settings: Record<string, unknown> | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [data, setData] = useState({
    whatsapp_number: (settings?.whatsapp_number as string) || '18096860050',
    delivery_time: (settings?.delivery_time as string) || '24-48 horas',
    shipping_cost: (settings?.shipping_cost as number) || 250,
    free_shipping_threshold: (settings?.free_shipping_threshold as number) || 5000,
    promo_banner_enabled: (settings?.promo_banner_enabled as boolean) || false,
    promo_banner_text: (settings?.promo_banner_text as string) || '',
    chatbot_enabled: (settings?.chatbot_enabled as boolean) || true,
    social_proof_enabled: (settings?.social_proof_enabled as boolean) || true,
    cardnet_enabled: (settings?.cardnet_enabled as boolean) || true,
    transfer_enabled: (settings?.transfer_enabled as boolean) || true,
    paypal_enabled: (settings?.paypal_enabled as boolean) || true,
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const result = await saveSettings(data)
    setMessage(result.error || '✅ Configuración guardada')
    setSaving(false)
  }

  const update = (field: string, value: unknown) => setData({ ...data, [field]: value })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Contacto y envíos</h2>
        <Input
          label="WhatsApp (sin +)"
          value={data.whatsapp_number}
          onChange={(e) => update('whatsapp_number', e.target.value)}
        />
        <Input
          label="Tiempo de entrega"
          value={data.delivery_time}
          onChange={(e) => update('delivery_time', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Costo envío (RD$)"
            type="number"
            value={data.shipping_cost}
            onChange={(e) => update('shipping_cost', Number(e.target.value))}
          />
          <Input
            label="Envío gratis desde (RD$)"
            type="number"
            value={data.free_shipping_threshold}
            onChange={(e) => update('free_shipping_threshold', Number(e.target.value))}
          />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Banner promocional</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.promo_banner_enabled}
            onChange={(e) => update('promo_banner_enabled', e.target.checked)}
          />
          Mostrar banner
        </label>
        {data.promo_banner_enabled && (
          <Input
            label="Texto del banner"
            value={data.promo_banner_text}
            onChange={(e) => update('promo_banner_text', e.target.value)}
            placeholder="🔥 ¡Oferta del día! Envío gratis en compras +RD$5,000"
          />
        )}
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Métodos de pago</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.cardnet_enabled} onChange={(e) => update('cardnet_enabled', e.target.checked)} />
            CardNET (tarjeta)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.transfer_enabled} onChange={(e) => update('transfer_enabled', e.target.checked)} />
            Transferencia bancaria
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.paypal_enabled} onChange={(e) => update('paypal_enabled', e.target.checked)} />
            PayPal
          </label>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h2 className="font-semibold">Funcionalidades</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.chatbot_enabled} onChange={(e) => update('chatbot_enabled', e.target.checked)} />
            Chatbot IA (Telo' Asistente)
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.social_proof_enabled} onChange={(e) => update('social_proof_enabled', e.target.checked)} />
            Social proof ("Juan compró hace 5 min")
          </label>
        </div>
      </Card>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {message}
        </p>
      )}

      <Button type="submit" loading={saving}>
        Guardar Configuración
      </Button>
    </form>
  )
}
