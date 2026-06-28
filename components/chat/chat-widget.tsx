'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { BRAND } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `¡Hola! Soy el asistente de ${BRAND.group}. ¿En qué puedo ayudarte? 🛒🎓📦🔧🛠️` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) throw new Error('Config missing')

      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || `Error ${res.status}`)
      }

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.response || 'No pude procesar tu pregunta. Intenta de nuevo.' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ No pude conectar con el asistente. Intenta de nuevo o escríbenos por WhatsApp.' }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[var(--c-primary)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={open ? 'Cerrar chat' : 'Abrir asistente'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-22 right-5 z-50 w-80 sm:w-96 h-[28rem] bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--c-border)] bg-[var(--c-primary)]">
            <p className="font-semibold text-white text-sm">Telo&apos; Asistente 🤖</p>
            <p className="text-xs text-white/70">Pregúntame lo que quieras</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--c-primary)] text-white rounded-br-sm'
                    : 'bg-[var(--c-surface-2)] text-[var(--c-text)] rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-[var(--c-surface-2)] text-sm">
                  <span className="animate-pulse">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--c-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 h-9 px-3 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg text-sm placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--c-info)]"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-lg bg-[var(--c-primary)] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
                aria-label="Enviar"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
