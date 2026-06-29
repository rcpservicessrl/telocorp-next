'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle } from 'lucide-react'
import { exportInventory, importInventory } from './actions'

interface Product {
  id: string
  title: string
  category: string
  price: number
  cost: number
  stock: number
  sold: number
  discount: number
  rating: number
  description: string
  image: string
  images: string[]
  specs: Record<string, string>
  active: boolean
  featured: boolean
}

interface ImportResult {
  success: boolean
  created: number
  updated: number
  errors: string[]
}

export function InventoryManager({ products }: { products: Product[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<Record<string, unknown>[] | null>(null)

  // Export to XLSX
  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await exportInventory()
      if (data.fileBase64) {
        // Download the file
        const blob = base64ToBlob(data.fileBase64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inventario-telosales-${new Date().toISOString().slice(0, 10)}.xlsx`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error(err)
    }
    setExporting(false)
  }

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResult(null)
    setPreview(null)

    // Read file as base64
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64 = (evt.target?.result as string).split(',')[1]
      if (!base64) return

      // Parse and preview
      try {
        const XLSX = await import('xlsx')
        const workbook = XLSX.read(base64, { type: 'base64' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
        setPreview(rows.slice(0, 5)) // Show first 5 rows as preview
      } catch {
        setResult({ success: false, created: 0, updated: 0, errors: ['Error al leer el archivo. Asegúrate de que sea un .xlsx válido.'] })
        return
      }
    }
    reader.readAsDataURL(file)
  }

  // Confirm import
  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setImporting(true)
    setResult(null)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64 = (evt.target?.result as string).split(',')[1]
      if (!base64) { setImporting(false); return }

      const res = await importInventory(base64)
      setResult(res)
      setPreview(null)
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Export section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download size={20} className="text-[var(--c-success)]" />
            <div>
              <h3 className="font-semibold">Exportar Inventario</h3>
              <p className="text-xs text-[var(--c-text-muted)]">
                Descarga todos los {products.length} productos en formato Excel
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleExport} loading={exporting}>
            <FileSpreadsheet size={16} />
            Descargar .xlsx
          </Button>
        </div>
      </Card>

      {/* Import section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Upload size={20} className="text-[var(--c-info)]" />
          <div>
            <h3 className="font-semibold">Importar / Actualizar Inventario</h3>
            <p className="text-xs text-[var(--c-text-muted)]">
              Sube un Excel modificado para actualizar precios, stock, descripciones y más
            </p>
          </div>
        </div>

        {/* File input */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="flex-1 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--c-surface-2)] file:text-[var(--c-text)] hover:file:bg-[var(--c-surface-3)] file:cursor-pointer"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Vista previa (primeras 5 filas):</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-[var(--c-border)] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[var(--c-surface-2)]">
                    {Object.keys(preview[0] || {}).slice(0, 8).map(key => (
                      <th key={key} className="px-2 py-1.5 text-left font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-[var(--c-border)]">
                      {Object.values(row).slice(0, 8).map((val, j) => (
                        <td key={j} className="px-2 py-1.5 truncate max-w-[150px]">{String(val ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button variant="sales" onClick={handleImport} loading={importing}>
              <Upload size={16} />
              Confirmar Importación
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? <CheckCircle size={16} className="text-[var(--c-success)]" /> : <AlertTriangle size={16} className="text-[var(--c-danger)]" />}
              <p className="font-medium text-sm">{result.success ? 'Importación completada' : 'Errores en importación'}</p>
            </div>
            {result.success && (
              <div className="flex gap-3 text-sm">
                <Badge variant="success">{result.created} creados</Badge>
                <Badge variant="info">{result.updated} actualizados</Badge>
              </div>
            )}
            {result.errors.length > 0 && (
              <ul className="mt-2 text-xs text-[var(--c-danger)] space-y-1">
                {result.errors.slice(0, 10).map((err, i) => <li key={i}>• {err}</li>)}
                {result.errors.length > 10 && <li>...y {result.errors.length - 10} errores más</li>}
              </ul>
            )}
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Formato del Excel</h3>
        <p className="text-sm text-[var(--c-text-muted)] mb-3">
          El archivo debe tener estas columnas (el encabezado debe coincidir exactamente):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-[var(--c-border)] rounded-lg">
            <thead>
              <tr className="bg-[var(--c-surface-2)]">
                <th className="px-2 py-1.5 text-left">Columna</th>
                <th className="px-2 py-1.5 text-left">Requerido</th>
                <th className="px-2 py-1.5 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody className="text-[var(--c-text-muted)]">
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">id</td><td>Para actualizar</td><td>UUID del producto (vacío = crear nuevo)</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">title</td><td>✓ Sí</td><td>Nombre del producto</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">category</td><td>✓ Sí</td><td>Categoría</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">price</td><td>✓ Sí</td><td>Precio en RD$</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">cost</td><td>No</td><td>Costo del producto</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">stock</td><td>✓ Sí</td><td>Unidades disponibles</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">discount</td><td>No</td><td>Porcentaje de descuento (0-100)</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">description</td><td>No</td><td>Descripción del producto</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">image</td><td>No</td><td>URL de imagen principal</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">active</td><td>No</td><td>true/false (visible en tienda)</td></tr>
              <tr className="border-t border-[var(--c-border)]"><td className="px-2 py-1.5 font-mono">featured</td><td>No</td><td>true/false (producto destacado)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--c-text-dim)] mt-3">
          💡 Tip: Exporta primero para obtener la plantilla con los datos actuales.
          Si una fila tiene <code className="bg-[var(--c-surface-2)] px-1 rounded">id</code> existente se actualiza; si está vacío se crea un producto nuevo.
        </p>
      </Card>
    </div>
  )
}

function base64ToBlob(base64: string, type: string): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type })
}
