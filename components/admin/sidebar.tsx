'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  GraduationCap,
  Truck,
  Wrench,
  HardHat,
  Users,
  Settings,
  Building2,
  BarChart3,
} from 'lucide-react'
import { cn, BRAND } from '@/lib/utils'

interface AdminSidebarProps {
  userEmail: string
  modules?: string[]
}

const ALL_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'analytics', label: 'Analíticas', icon: BarChart3, href: '/admin/analytics' },
  { id: 'sales', label: BRAND.sales, icon: ShoppingCart, href: '/admin/sales' },
  { id: 'educa', label: BRAND.educa, icon: GraduationCap, href: '/admin/educa' },
  { id: 'lleva', label: BRAND.lleva, icon: Truck, href: '/admin/lleva' },
  { id: 'repara', label: BRAND.repara, icon: Wrench, href: '/admin/repara' },
  { id: 'instala', label: BRAND.instala, icon: HardHat, href: '/admin/instala' },
  { id: 'users', label: 'Usuarios', icon: Users, href: '/admin/users' },
  { id: 'orgs', label: 'Organizaciones', icon: Building2, href: '/admin/organizations' },
  { id: 'settings', label: 'Configuración', icon: Settings, href: '/admin/settings' },
]

export function AdminSidebar({ userEmail, modules }: AdminSidebarProps) {
  const pathname = usePathname()

  // If user has specific modules, filter sidebar. @telocg.com sees all.
  const isSuperAdmin = userEmail.endsWith('@telocg.com')
  const visibleSections = isSuperAdmin
    ? ALL_SECTIONS
    : ALL_SECTIONS.filter(s => s.id === 'dashboard' || modules?.includes(s.id))

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--c-border)] bg-[var(--c-surface)] hidden lg:block">
      <nav className="p-3 space-y-1" aria-label="Admin navigation">
        {visibleSections.map((section) => {
          const isActive = pathname === section.href ||
            (section.href !== '/admin' && pathname.startsWith(section.href))

          return (
            <Link
              key={section.id}
              href={section.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive
                  ? 'bg-[var(--c-surface-2)] text-[var(--c-text)] font-medium'
                  : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-2)]'
              )}
            >
              <section.icon size={18} />
              {section.label}
            </Link>
          )
        })}
      </nav>

      {/* User info at bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="px-3 py-2 text-xs text-[var(--c-text-dim)] truncate">
          {userEmail}
        </div>
      </div>
    </aside>
  )
}
