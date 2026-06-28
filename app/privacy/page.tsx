import { BRAND } from '@/lib/utils'

export const metadata = { title: 'Política de Privacidad' }

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 prose prose-invert prose-sm">
      <h1>Política de Privacidad</h1>
      <p className="text-[var(--c-text-muted)]">Última actualización: Junio 2026</p>

      <h2>1. Información que Recopilamos</h2>
      <p>{BRAND.group} recopila la siguiente información:</p>
      <ul>
        <li>Datos de registro: nombre, email, teléfono</li>
        <li>Información de envío: dirección, ciudad</li>
        <li>Historial de compras y servicios</li>
        <li>Datos de uso de la plataforma (anónimos)</li>
      </ul>

      <h2>2. Uso de la Información</h2>
      <p>Utilizamos tu información para:</p>
      <ul>
        <li>Procesar pedidos y servicios solicitados</li>
        <li>Enviar notificaciones sobre el estado de tus servicios</li>
        <li>Mejorar la experiencia de usuario</li>
        <li>Comunicaciones de marketing (con tu consentimiento)</li>
      </ul>

      <h2>3. Compartir Información</h2>
      <p>No vendemos ni compartimos tu información personal con terceros, excepto:</p>
      <ul>
        <li>Conductores asignados a tu envío (nombre y dirección de entrega)</li>
        <li>Técnicos asignados a tu servicio (dirección del servicio)</li>
        <li>Procesadores de pago (CardNET, PayPal) para completar transacciones</li>
        <li>Cuando sea requerido por ley</li>
      </ul>

      <h2>4. Seguridad</h2>
      <p>Implementamos medidas de seguridad técnicas y organizacionales para proteger tu información, incluyendo encriptación, autenticación segura y acceso restringido.</p>

      <h2>5. Cookies</h2>
      <p>Utilizamos cookies esenciales para el funcionamiento de la plataforma (sesión de usuario, carrito de compras). No utilizamos cookies de rastreo de terceros.</p>

      <h2>6. Tus Derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a tu información personal</li>
        <li>Corregir datos inexactos</li>
        <li>Solicitar la eliminación de tu cuenta</li>
        <li>Desuscribirte de comunicaciones de marketing</li>
      </ul>

      <h2>7. Retención de Datos</h2>
      <p>Mantenemos tu información mientras tu cuenta esté activa. Puedes solicitar la eliminación en cualquier momento contactando a info@telocg.com.</p>

      <h2>8. Contacto</h2>
      <p>Para consultas sobre privacidad: info@telocg.com</p>
    </main>
  )
}
