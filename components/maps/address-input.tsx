'use client'

import { useEffect, useRef, useState } from 'react'

interface AddressInputProps {
  label: string
  value: string
  onChange: (value: string, placeId?: string) => void
  placeholder?: string
}

/**
 * Google Maps Places Autocomplete input.
 * Loads the Google Maps script lazily on first focus.
 */
export function AddressInput({ label, value, onChange, placeholder }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Check if already loaded
    if ((window as any).google?.maps?.places) {
      setLoaded(true)
      return
    }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return

    // Load script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=es`
    script.async = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!loaded || !inputRef.current || autocompleteRef.current) return

    const g = (window as any).google
    if (!g?.maps?.places) return

    const autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'do' },
      fields: ['formatted_address', 'place_id', 'geometry'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChange(place.formatted_address, place.place_id || undefined)
      }
    })

    autocompleteRef.current = autocomplete
  }, [loaded, onChange])

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Buscar dirección...'}
        className="w-full h-10 px-3 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-lg text-sm placeholder:text-[var(--c-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--c-info)]"
      />
    </div>
  )
}
