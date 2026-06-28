'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function PromoBanner() {
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('site_settings')
      .select('promo_banner_enabled, promo_banner_text')
      .single()
      .then(({ data }) => {
        if (data?.promo_banner_enabled && data?.promo_banner_text) {
          setText(data.promo_banner_text)
        }
      })
  }, [])

  if (!text || dismissed) return null

  return (
    <div className="bg-[var(--c-primary)] text-white text-center text-sm py-2 px-4 relative">
      <p>{text}</p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
        aria-label="Cerrar banner"
      >
        <X size={14} />
      </button>
    </div>
  )
}
