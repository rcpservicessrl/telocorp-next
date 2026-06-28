import Link from 'next/link'
import { BRAND, VERTICALS } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="border-t border-[var(--c-border)] bg-[var(--c-surface)]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold mb-3">
              <img src="/assets/telocorpgroup-mark.png" alt="" className="h-8 w-8 rounded-lg" />
              {BRAND.group}
            </Link>
            <p className="text-sm text-[var(--c-text-muted)]">
              Plataforma digital integrada en República Dominicana.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Servicios</h4>
            <ul className="space-y-2">
              {Object.values(VERTICALS).map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="text-sm text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition-colors">
                    {v.icon} {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Soporte</h4>
            <ul className="space-y-2 text-sm text-[var(--c-text-muted)]">
              <li><Link href="/help" className="hover:text-[var(--c-text)] transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--c-text)] transition-colors">Contacto</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--c-text)] transition-colors">Términos</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--c-text)] transition-colors">Privacidad</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-[var(--c-text-muted)]">
              <li>
                <a href="https://wa.me/18096860050" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--c-text)] transition-colors">
                  📱 WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@telocg.com" className="hover:text-[var(--c-text)] transition-colors">
                  ✉️ info@telocg.com
                </a>
              </li>
              <li>📍 Santo Domingo, RD</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--c-border)] text-center text-xs text-[var(--c-text-dim)]">
          © {new Date().getFullYear()} {BRAND.group}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
