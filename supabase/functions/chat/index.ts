import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ reply: 'El asistente IA no está configurado. Contacta por WhatsApp.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { message, context, history } = await req.json()

    const systemPrompt = `Eres Telo' Asistente, el asistente IA oficial de Telo' Corp Group (telocg.com). Responde siempre en español dominicano, de forma concisa, profesional y útil.
Servicios:
- Telo' Sales: tienda de tecnología y accesorios con envío express en RD
- Telo' Educa: academia online con cursos de tecnología
- Telo' Lleva: mensajería y envíos express
- Telo' Repara: reparación de celulares, laptops, TV y más (garantía 90 días)
- Telo' Instala: instalación de TV, A/C, cámaras, paneles solares
WhatsApp de contacto: +1 (809) 903-8707
Web: telocg.com
${context || ''}`

    // Build conversation with history
    const contents = []
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-4)) {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] })
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] })

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    )

    // Handle HTTP errors from Gemini
    if (!res.ok) {
      const status = res.status
      const errorBody = await res.text()
      console.error(`[chat] Gemini HTTP ${status}:`, errorBody)

      if (status === 429) {
        return new Response(JSON.stringify({ error: 'rate_limit', reply: '⏳ Muchas consultas. Intenta en un minuto.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (status === 401 || status === 403) {
        return new Response(JSON.stringify({ error: 'auth_failed', reply: '🔑 La clave de IA necesita renovarse. Contacta al admin.' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ error: 'api_error', reply: 'Error temporal del asistente. Intenta de nuevo.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta. Reformula tu pregunta.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[chat] Exception:', error)
    return new Response(JSON.stringify({ reply: 'Error interno. Contacta por WhatsApp: +1 (809) 903-8707' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
