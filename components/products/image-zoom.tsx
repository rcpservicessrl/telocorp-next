'use client'

import { useRef, useState } from 'react'

interface ImageZoomProps {
  src: string
  alt: string
}

/**
 * Amazon-style hover zoom on product images.
 * On hover/touch, zooms 2.5x following cursor position.
 */
export function ImageZoom({ src, alt }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zooming, setZooming] = useState(false)
  const [origin, setOrigin] = useState('center center')

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
    setZooming(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !e.touches[0]) return
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
    setZooming(true)
  }

  return (
    <div
      ref={containerRef}
      className="aspect-square bg-[var(--c-surface)] rounded-2xl overflow-hidden border border-[var(--c-border)] cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZooming(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setZooming(false)}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-100"
          style={{
            transform: zooming ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: origin,
          }}
          draggable={false}
        />
      )}
    </div>
  )
}
