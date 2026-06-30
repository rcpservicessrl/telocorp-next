'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PromoBanner } from '@/components/layout/promo-banner'
import { ChatWidget } from '@/components/chat/chat-widget'
import { OrganizationJsonLd } from '@/components/seo/json-ld'
import { ExitPopup } from '@/components/products/exit-popup'
import { GA4 } from '@/components/analytics/ga4'

/**
 * Client shell — wraps all non-admin pages with Header, Footer, Chat, etc.
 * Admin pages get their own layout without this shell.
 */
export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Admin routes have their own layout — don't show client shell
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
      <OrganizationJsonLd />
      <GA4 />
      <PromoBanner />
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <ChatWidget />
      <ExitPopup />
    </>
  )
}
