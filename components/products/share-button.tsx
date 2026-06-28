'use client'

import { useState } from 'react'
import { Share2, Check, MessageCircle, Copy } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
  price: number
}

export function ShareButton({ title, url, price }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = `Mira esto: ${title} — RD$ ${price.toLocaleString()} en Telo' Sales`
  const fullUrl = `https://telocg.com${url}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${fullUrl}`)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = fullUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
        aria-label="Compartir"
      >
        <Share2 size={18} className="text-[var(--c-text-muted)]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl shadow-lg z-50 overflow-hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--c-surface-2)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <MessageCircle size={16} className="text-green-500" />
              WhatsApp
            </a>
            <button
              onClick={() => { copyLink(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--c-surface-2)] transition-colors"
            >
              {copied ? <Check size={16} className="text-[var(--c-success)]" /> : <Copy size={16} />}
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
