'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onUploaded: (url: string) => void
  className?: string
}

/**
 * Upload images directly to ImgBB from admin.
 * Uses the ImgBB API directly (key is public/free tier).
 */
export function ImageUpload({ onUploaded, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Máximo 10MB por imagen')
      return
    }

    setUploading(true)
    setError('')
    setPreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('https://api.imgbb.com/1/upload?key=8199e433dfe9c12d1f452ce857dbce9d', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        const imageUrl = data.data.url
        onUploaded(imageUrl)
        setPreview(null)
      } else {
        setError('Error al subir: ' + (data.error?.message || 'intenta de nuevo'))
        setPreview(null)
      }
    } catch {
      setError('Error de conexión al subir imagen')
      setPreview(null)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-[var(--c-border)] rounded-xl p-4 text-center hover:border-[var(--c-info)] transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 size={24} className="animate-spin text-[var(--c-info)]" />
            <p className="text-xs text-[var(--c-text-muted)]">Subiendo a ImgBB...</p>
          </div>
        ) : preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="h-20 rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload size={20} className="text-[var(--c-text-dim)]" />
            <p className="text-xs text-[var(--c-text-muted)]">Click o arrastra imagen aquí</p>
            <p className="text-[10px] text-[var(--c-text-dim)]">JPG, PNG, WebP · Máx 10MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-[var(--c-danger)] mt-1">{error}</p>}
    </div>
  )
}
