import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "Telo' Corp Group | Plataforma Digital",
    template: "%s | Telo' Corp Group",
  },
  description: 'Plataforma digital integrada: comercio electrónico, academia online, logística y servicios técnicos en República Dominicana.',
  metadataBase: new URL('https://telocg.com'),
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://telocg.com',
    siteName: "Telo' Corp Group",
    images: [{ url: '/assets/telocorpgroup-logo.jpg', width: 512, height: 512 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/telocorpgroup-mark.png', apple: '/assets/telocorpgroup-mark.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
