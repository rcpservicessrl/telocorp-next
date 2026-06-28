import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Telo&apos; Corp Group
        </h1>
        <p className="text-[var(--c-text-muted)] text-lg mb-8">
          Plataforma digital integrada: comercio, educación, logística y servicios técnicos.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/products" className="p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-sales)] transition-colors text-center">
            <span className="text-2xl">🛒</span>
            <p className="mt-2 font-semibold">TeloSales</p>
          </Link>
          <Link href="/educa" className="p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-educa)] transition-colors text-center">
            <span className="text-2xl">🎓</span>
            <p className="mt-2 font-semibold">TeloEduca</p>
          </Link>
          <Link href="/lleva" className="p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-lleva)] transition-colors text-center">
            <span className="text-2xl">📦</span>
            <p className="mt-2 font-semibold">TeloLleva</p>
          </Link>
          <Link href="/repara" className="p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-repara)] transition-colors text-center">
            <span className="text-2xl">🔧</span>
            <p className="mt-2 font-semibold">TeloRepara</p>
          </Link>
          <Link href="/instala" className="p-6 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-instala)] transition-colors text-center">
            <span className="text-2xl">🛠️</span>
            <p className="mt-2 font-semibold">TeloInstala</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
