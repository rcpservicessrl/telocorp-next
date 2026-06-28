import Link from 'next/link'
import { BRAND, VERTICALS } from '@/lib/utils'

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Todo lo que necesitas,<br />
          <span className="text-[var(--c-primary)]">en un solo lugar</span>
        </h1>
        <p className="text-lg text-[var(--c-text-muted)] max-w-xl mx-auto">
          {BRAND.group} es tu plataforma digital integrada: compra, aprende,
          envía, repara e instala — todo desde aquí.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {Object.entries(VERTICALS).map(([key, v]) => (
          <Link
            key={key}
            href={v.href}
            className="group relative p-6 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"
              style={{ backgroundColor: v.color }}
            />
            <span className="text-3xl block mb-3">{v.icon}</span>
            <h2 className="text-lg font-bold mb-1">{v.name}</h2>
            <p className="text-sm text-[var(--c-text-muted)]">{v.description}</p>
            <div
              className="mt-4 inline-flex items-center text-sm font-medium gap-1"
              style={{ color: v.color }}
            >
              Explorar
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}

        {/* CTA card */}
        <Link
          href="/auth/register"
          className="p-6 rounded-2xl border-2 border-dashed border-[var(--c-border)] hover:border-[var(--c-primary)] flex flex-col items-center justify-center text-center transition-colors"
        >
          <span className="text-3xl mb-2">✨</span>
          <h2 className="text-lg font-bold">Crea tu cuenta</h2>
          <p className="text-sm text-[var(--c-text-muted)] mt-1">
            Accede a todos los servicios con un solo login
          </p>
        </Link>
      </section>

      {/* Value props */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-[var(--c-success)]">5</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Servicios integrados</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--c-sales)]">24h</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Envíos express</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--c-educa)]">100%</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Digital y seguro</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--c-instala)]">🇩🇴</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">Hecho en RD</p>
        </div>
      </section>
    </main>
  )
}
