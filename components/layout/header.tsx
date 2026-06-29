'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { BRAND, VERTICALS, type Vertical } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { CartButton } from '@/components/cart/cart-button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-[var(--c-bg)]/80 backdrop-blur-md border-b border-[var(--c-border)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/assets/telocorpgroup-mark.png"
              alt={BRAND.group}
              className="h-8 w-8 rounded-lg"
            />
            <span className="hidden sm:inline">{BRAND.group}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {(Object.entries(VERTICALS) as [Vertical, typeof VERTICALS[Vertical]][]).map(([key, v]) => (
              <Link
                key={key}
                href={v.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--c-text-muted)] hover:text-[var(--c-text)] rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
              >
                <span>{v.icon}</span>
                <span>{v.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <CartButton />
            {user ? (
              <>
                <NotificationBell />
                <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-[var(--c-surface-2)] transition-colors"
                  aria-label="Menú de usuario"
                >
                  <User size={18} />
                  <span className="hidden sm:inline text-[var(--c-text-muted)]">
                    {user.email?.split('@')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--c-surface-2)] rounded-t-xl"
                  >
                    <User size={16} />
                    Mi Panel
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--c-danger)] hover:bg-[var(--c-surface-2)] rounded-b-xl"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-1.5 text-sm font-medium bg-[var(--c-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Entrar
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--c-surface-2)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-[var(--c-border)]" aria-label="Navegación móvil">
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(VERTICALS) as [Vertical, typeof VERTICALS[Vertical]][]).map(([key, v]) => (
                <Link
                  key={key}
                  href={v.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-colors"
                >
                  <span className="text-lg">{v.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-[var(--c-text-dim)]">{v.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
