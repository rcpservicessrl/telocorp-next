import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Brand names — Always with apostrophe
 */
export const BRAND = {
  group: "Telo' Corp Group",
  sales: "Telo' Sales",
  educa: "Telo' Educa",
  lleva: "Telo' Lleva",
  repara: "Telo' Repara",
  instala: "Telo' Instala",
} as const

export type Vertical = 'sales' | 'educa' | 'lleva' | 'repara' | 'instala'

export const VERTICALS: Record<Vertical, { name: string; icon: string; color: string; href: string; description: string }> = {
  sales: {
    name: BRAND.sales,
    icon: '🛒',
    color: 'var(--c-sales)',
    href: '/products',
    description: 'Tienda de tecnología y accesorios',
  },
  educa: {
    name: BRAND.educa,
    icon: '🎓',
    color: 'var(--c-educa)',
    href: '/educa',
    description: 'Academia y cursos en línea',
  },
  lleva: {
    name: BRAND.lleva,
    icon: '📦',
    color: 'var(--c-lleva)',
    href: '/lleva',
    description: 'Envíos y logística express',
  },
  repara: {
    name: BRAND.repara,
    icon: '🔧',
    color: 'var(--c-repara)',
    href: '/repara',
    description: 'Reparación de dispositivos',
  },
  instala: {
    name: BRAND.instala,
    icon: '🛠️',
    color: 'var(--c-instala)',
    href: '/instala',
    description: 'Servicios de instalación',
  },
}
