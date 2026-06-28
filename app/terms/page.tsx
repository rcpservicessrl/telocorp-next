import { BRAND } from '@/lib/utils'

export const metadata = { title: 'Términos y Condiciones' }

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 prose prose-invert prose-sm">
      <h1>Términos y Condiciones</h1>
      <p className="text-[var(--c-text-muted)]">Última actualización: Junio 2026</p>

      <h2>1. Aceptación de Términos</h2>
      <p>Al utilizar la plataforma {BRAND.group} (telocg.com), aceptas estos términos y condiciones en su totalidad.</p>

      <h2>2. Servicios</h2>
      <p>{BRAND.group} ofrece una plataforma digital integrada que incluye:</p>
      <ul>
        <li>{BRAND.sales} — Comercio electrónico de tecnología</li>
        <li>{BRAND.educa} — Cursos y educación en línea</li>
        <li>{BRAND.lleva} — Servicios de mensajería y logística</li>
        <li>{BRAND.repara} — Reparación de dispositivos electrónicos</li>
        <li>{BRAND.instala} — Servicios de instalación profesional</li>
      </ul>

      <h2>3. Registro de Cuenta</h2>
      <p>Para acceder a ciertos servicios, debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu contraseña.</p>

      <h2>4. Compras y Pagos</h2>
      <p>Los precios están expresados en Pesos Dominicanos (DOP). Aceptamos pagos via CardNET, transferencia bancaria y PayPal. Los precios pueden cambiar sin previo aviso.</p>

      <h2>5. Envíos y Entregas</h2>
      <p>Los tiempos de entrega estimados son de 24-48 horas en Santo Domingo y 2-4 días para el interior del país. Estos tiempos son estimados y no constituyen una garantía.</p>

      <h2>6. Devoluciones</h2>
      <p>Tienes 7 días naturales desde la recepción para solicitar una devolución, siempre que el producto esté en su estado original y empaque.</p>

      <h2>7. Garantía</h2>
      <p>Los servicios de reparación tienen 90 días de garantía en mano de obra. Los productos nuevos tienen la garantía del fabricante.</p>

      <h2>8. Propiedad Intelectual</h2>
      <p>Todo el contenido de la plataforma (textos, imágenes, logos, código) es propiedad de {BRAND.group} o sus licenciantes.</p>

      <h2>9. Limitación de Responsabilidad</h2>
      <p>{BRAND.group} no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.</p>

      <h2>10. Contacto</h2>
      <p>Para consultas sobre estos términos: info@telocg.com</p>
    </main>
  )
}
