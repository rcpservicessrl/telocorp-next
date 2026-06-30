import { BRAND } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Centro de Ayuda',
  description: `Preguntas frecuentes y guías de uso de ${BRAND.group}`,
}

const SECTIONS = [
  {
    title: '🛒 Compras',
    items: [
      { q: '¿Cómo hago un pedido?', a: 'Navega los productos, agrégalos al carrito y procede al checkout. Completa tus datos y elige un método de pago.' },
      { q: '¿Cuánto tarda el envío?', a: 'Santo Domingo: 24-48 horas. Interior: 2-4 días hábiles.' },
      { q: '¿Cuál es el costo del envío?', a: 'RD$250 en pedidos menores a RD$5,000. Envío GRATIS en pedidos mayores.' },
      { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 7 días para solicitar devolución. El producto debe estar en su empaque original.' },
      { q: '¿Tienen descuentos?', a: 'Sí. Usa cupones en el checkout (ej: PRIMERA10). También hay descuento automático por volumen: 5% con 3+ items, 10% con 5+ items.' },
    ]
  },
  {
    title: '🔧 Reparación',
    items: [
      { q: '¿Qué dispositivos reparan?', a: 'Celulares, laptops, tablets, TV, consolas, impresoras, inversores y aires acondicionados.' },
      { q: '¿Cuánto tarda una reparación?', a: 'Depende del dispositivo. Diagnóstico en 24h, reparación típica 1-3 días.' },
      { q: '¿Tienen garantía?', a: '90 días de garantía en mano de obra para todas las reparaciones.' },
      { q: '¿Recogen a domicilio?', a: 'Sí. Al solicitar reparación puedes elegir "Recogida a domicilio" y un mensajero pasa por tu dispositivo.' },
    ]
  },
  {
    title: '🛠️ Instalación',
    items: [
      { q: '¿Qué servicios de instalación ofrecen?', a: 'TV/sonido, A/C, cámaras CCTV, paneles solares, redes WiFi y trabajos eléctricos.' },
      { q: '¿Los técnicos están certificados?', a: 'Sí, todos nuestros técnicos están verificados y tienen experiencia comprobable.' },
      { q: '¿Puedo elegir fecha y hora?', a: 'Sí. Al agendar seleccionas fecha preferida y turno (mañana, tarde o noche).' },
    ]
  },
  {
    title: '📦 Envíos',
    items: [
      { q: '¿Cuánto cuesta un envío?', a: 'Desde RD$150 (moto). El precio varía por vehículo, distancia y tipo de servicio.' },
      { q: '¿Puedo rastrear mi envío?', a: 'Sí. Después de solicitar, recibes un link de seguimiento con el estado en tiempo real.' },
      { q: '¿Qué vehículos tienen?', a: 'Motos (paquetes pequeños), autos (medianos) y vans (cargas grandes).' },
    ]
  },
  {
    title: '🎓 Educación',
    items: [
      { q: '¿Los cursos son gratis?', a: 'Actualmente todos los cursos son gratuitos. Próximamente habrá cursos premium.' },
      { q: '¿Cómo obtengo mi certificado?', a: 'Completa todas las lecciones y aprueba el quiz con 70% o más.' },
      { q: '¿Los certificados son verificables?', a: 'Sí. Cada certificado tiene un ID único verificable públicamente en telocg.com/verify/' },
    ]
  },
  {
    title: '👤 Cuenta',
    items: [
      { q: '¿Cómo creo una cuenta?', a: 'Click en "Entrar" → "Crear cuenta". Solo necesitas email y contraseña.' },
      { q: '¿Puedo usar la tienda sin cuenta?', a: 'Sí. Puedes comprar sin cuenta, pero con cuenta guardas historial, wishlist y progreso de cursos.' },
      { q: '¿Cómo contacto soporte?', a: 'WhatsApp: +1 (809) 903-8707 o email: info@telocg.com' },
    ]
  },
]

export default function HelpPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
      <p className="text-[var(--c-text-muted)] mb-8">
        Encuentra respuestas a las preguntas más frecuentes sobre {BRAND.group}.
      </p>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <Card key={i} className="p-4">
                  <p className="font-medium text-sm">{item.q}</p>
                  <p className="text-sm text-[var(--c-text-muted)] mt-1">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-center">
        <p className="text-lg font-semibold mb-2">¿No encontraste lo que buscas?</p>
        <p className="text-sm text-[var(--c-text-muted)] mb-4">Escríbenos directamente y te ayudamos.</p>
        <div className="flex gap-3 justify-center">
          <a href="https://wa.me/8099038707" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[var(--c-success)] text-white text-sm font-medium rounded-lg hover:opacity-90">
            WhatsApp 📱
          </a>
          <Link href="/contact" className="px-4 py-2 bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm font-medium rounded-lg hover:bg-[var(--c-surface-3)]">
            Más opciones
          </Link>
        </div>
      </div>
    </main>
  )
}
