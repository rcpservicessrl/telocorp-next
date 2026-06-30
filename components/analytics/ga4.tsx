'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface GA4Props {
  measurementId?: string
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

/**
 * Google Analytics 4 integration.
 * Tracks page views automatically on route change.
 * Call trackEvent() for custom events (add_to_cart, purchase, etc.)
 */
export function GA4({ measurementId }: GA4Props) {
  const pathname = usePathname()
  const id = measurementId || process.env.NEXT_PUBLIC_GA4_ID

  useEffect(() => {
    if (!id || !window.gtag) return
    window.gtag('config', id, { page_path: pathname })
  }, [pathname, id])

  if (!id) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}

/**
 * Track custom GA4 events from anywhere in the app.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}
