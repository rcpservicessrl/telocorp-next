import type { Metadata } from 'next'
import { BRAND } from '@/lib/utils'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { RegisterSW } from '@/components/pwa/register-sw'
import { ClientShell } from '@/components/layout/client-shell'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${BRAND.group} | Plataforma Digital`,
    template: `%s | ${BRAND.group}`,
  },
  description: 'Plataforma digital integrada: comercio electrónico, academia online, logística y servicios técnicos en República Dominicana.',
  metadataBase: new URL('https://telocg.com'),
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://telocg.com',
    siteName: BRAND.group,
    images: [{ url: '/assets/telocorpgroup-logo.jpg', width: 512, height: 512 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/telocorpgroup-mark.png', apple: '/assets/telocorpgroup-mark.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO">
      <body className="min-h-screen antialiased flex flex-col">
        <RegisterSW />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ClientShell>
                {children}
              </ClientShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
