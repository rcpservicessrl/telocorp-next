/**
 * Email transaccional — preparado para Resend.
 * Cuando RESEND_API_KEY esté disponible, envía emails reales.
 * Si no, log silencioso (no bloquea).
 */

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail(params: EmailParams): Promise<{ error: string | null }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // Silently skip — email not configured yet
    console.log(`[EMAIL SKIP] To: ${params.to} | Subject: ${params.subject}`)
    return { error: null }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Telo' Corp Group <noreply@telocg.com>",
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      return { error: `Email failed: ${error}` }
    }

    return { error: null }
  } catch (err) {
    return { error: 'Email service unavailable' }
  }
}

/**
 * Pre-built email templates
 */
export const emailTemplates = {
  orderConfirmation(orderNumber: string, total: number, items: string[]) {
    return {
      subject: `Pedido confirmado — #${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">¡Pedido Confirmado! 🎉</h2>
          <p>Tu orden <strong>#${orderNumber}</strong> ha sido recibida.</p>
          <p><strong>Total:</strong> RD$ ${total.toLocaleString()}</p>
          <h3>Productos:</h3>
          <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
          <p>Te contactaremos por WhatsApp para coordinar el pago y envío.</p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Telo' Corp Group — telocg.com</p>
        </div>
      `,
    }
  },

  statusUpdate(service: string, ticketNumber: string, newStatus: string) {
    return {
      subject: `${service} — Estado actualizado`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Actualización de tu solicitud</h2>
          <p>Tu ticket <strong>#${ticketNumber}</strong> en ${service} ha cambiado a:</p>
          <p style="font-size: 18px; font-weight: bold; color: #22c55e;">${newStatus}</p>
          <p>Puedes ver el detalle en tu panel: <a href="https://telocg.com/dashboard">telocg.com/dashboard</a></p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Telo' Corp Group — telocg.com</p>
        </div>
      `,
    }
  },

  welcome(name: string) {
    return {
      subject: `¡Bienvenido a Telo' Corp Group!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Hola ${name}! 👋</h2>
          <p>Bienvenido a Telo' Corp Group, tu plataforma digital integrada.</p>
          <p>Ahora puedes:</p>
          <ul>
            <li>🛒 Comprar tecnología con envío express</li>
            <li>🎓 Tomar cursos en línea</li>
            <li>📦 Enviar paquetes</li>
            <li>🔧 Solicitar reparaciones</li>
            <li>🛠️ Agendar instalaciones</li>
          </ul>
          <p>Todo desde un solo lugar: <a href="https://telocg.com">telocg.com</a></p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Telo' Corp Group — Santo Domingo, RD</p>
        </div>
      `,
    }
  },
}
