'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getWhatsAppProducts, importWhatsAppProducts } from './actions'
import { ParsedProduct } from '@/lib/whatsapp-parser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Tag, 
  UploadCloud, 
  Plus, 
  Search,
  Filter,
  CheckCircle2,
  Package
} from 'lucide-react'
import { BRAND } from '@/lib/utils'

export default function WhatsAppImporterPage() {
  const [products, setProducts] = useState<ParsedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [importing, setImporting] = useState(false)

  // Load products from WhatsApp parser (via server action)
  useEffect(() => {
    async function loadData() {
      try {
        const { products: data, error: err } = await getWhatsAppProducts()
        if (err) {
          setError(err)
        } else {
          setProducts(data)
          // By default, select all products that have a cost > 0
          setSelectedIds(data.filter(p => p.cost > 0).map(p => p.id))
        }
      } catch (e) {
        setError('Error al cargar los productos virtualizados.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Handle individual value changes (inline editing)
  const handleEditProduct = (id: string, field: keyof ParsedProduct, value: any) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p
      
      const updated = { ...p, [field]: value }
      
      // If cost changed, recalculate price automatically
      if (field === 'cost') {
        const costNum = parseFloat(value) || 0
        let newPrice = 0
        if (costNum > 0) {
          if (costNum < 200) {
            newPrice = costNum * 2.5 // +150%
          } else if (costNum < 1000) {
            newPrice = costNum * 2.0 // +100%
          } else {
            newPrice = costNum * 1.5 // +50%
          }
          newPrice = Math.round(newPrice / 10) * 10
        }
        updated.price = newPrice
      }
      
      return updated
    }))
  }

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Toggle select all filtered
  const handleSelectAll = (filteredProducts: ParsedProduct[]) => {
    const filteredIds = filteredProducts.map(p => p.id)
    const allSelected = filteredIds.every(id => selectedIds.includes(id))
    
    if (allSelected) {
      // Remove all filtered from selection
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)))
    } else {
      // Add all filtered to selection
      setSelectedIds(prev => [...new Set([...prev, ...filteredIds])])
    }
  }

  // Run the batch import to database
  const handleImport = async () => {
    const productsToImport = products.filter(p => selectedIds.includes(p.id))
    if (productsToImport.length === 0) {
      setStatusMessage({ type: 'error', text: 'No seleccionaste ningún producto.' })
      return
    }

    setImporting(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const { error: err } = await importWhatsAppProducts(productsToImport)
      if (err) {
        setStatusMessage({ type: 'error', text: `Error: ${err}` })
      } else {
        setStatusMessage({ 
          type: 'success', 
          text: `¡Éxito! Se importaron/actualizaron ${productsToImport.length} productos en la tienda.` 
        })
        // Remove imported products from list
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)))
        setSelectedIds([])
      }
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Error de red al intentar importar.' })
    } finally {
      setImporting(false)
    }
  }

  // Filters logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--c-text-muted)]">
        <div className="w-12 h-12 border-4 border-[var(--c-sales)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Virtualizando chat de WhatsApp y extrayendo catálogo...</p>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6" id="whatsapp-importer-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--c-border)]">
        <div>
          <Link href="/admin/sales" className="flex items-center gap-2 text-xs text-[var(--c-text-muted)] hover:text-[var(--c-sales)] mb-2 transition-colors">
            <ArrowLeft size={14} /> Volver a Inventario
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-[#25D366]">💬</span> Virtualizador de Catálogo WhatsApp
          </h1>
          <p className="text-xs text-[var(--c-text-dim)] mt-1">
            Extraído de: <span className="font-mono">Chat con Dickson Express / SmartPhone</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[var(--c-text-muted)]">Seleccionados</p>
            <p className="text-sm font-bold text-[var(--c-sales)]">{selectedIds.length} / {products.length}</p>
          </div>
          <Button 
            onClick={handleImport} 
            disabled={importing || selectedIds.length === 0}
            className="bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-500/10 hover:shadow-green-500/20 active:scale-[0.98] transition-all"
            id="publish-catalog-button"
          >
            {importing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <UploadCloud size={16} />
            )}
            Publicar Catálogo ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage.text && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
          statusMessage.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`} id="status-notification">
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
          <div>
            <p className="text-sm font-medium">{statusMessage.text}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filters & Control bar */}
      <div className="bg-[var(--c-surface)] border border-[var(--c-border)] p-4 rounded-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-text-dim)]">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg focus:outline-none focus:border-[var(--c-sales)] text-[var(--c-text)] placeholder-[var(--c-text-dim)]"
              id="whatsapp-search-input"
            />
          </div>
          
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-lg focus:outline-none focus:border-[var(--c-sales)] text-[var(--c-text)] appearance-none cursor-pointer"
              id="whatsapp-category-filter"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'Todas las Categorías' : c}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-text-dim)] pointer-events-none">
              <Filter size={14} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <p className="text-xs text-[var(--c-text-muted)]">
            Mostrando <span className="font-bold text-[var(--c-text)]">{filteredProducts.length}</span> de <span className="font-bold text-[var(--c-text)]">{products.length}</span> productos
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleSelectAll(filteredProducts)}
            className="text-xs border-[var(--c-border)] hover:bg-[var(--c-surface-2)] rounded-lg py-1 px-3"
            id="select-all-filtered-button"
          >
            {filteredProducts.every(p => selectedIds.includes(p.id)) ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </Button>
        </div>
      </div>

      {/* Main Workspace: Left Mock Chat, Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Mock WhatsApp Web Chat */}
        <div className="lg:col-span-4 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl overflow-hidden flex flex-col h-[650px] shadow-sm">
          {/* Mock Header */}
          <div className="p-3 bg-[var(--c-surface-2)] border-b border-[var(--c-border)] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center rounded-full text-base font-bold">
              📱
            </div>
            <div>
              <p className="font-semibold text-sm text-[var(--c-text)]">Dickson Express / SmartPhone</p>
              <p className="text-[10px] text-green-400 font-medium">En línea • Proveedor mayorista</p>
            </div>
          </div>

          {/* Mock Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#0b141a]/95 space-y-4 font-sans" id="mock-chat-messages">
            <div className="text-[10px] text-[var(--c-text-muted)] bg-gray-800/60 w-fit mx-auto px-3 py-1 rounded-full text-center">
              HOY
            </div>

            {filteredProducts.slice(0, 10).map((p, index) => (
              <div key={p.id} className="space-y-2">
                {/* Image block sent by supplier */}
                <div className="max-w-[85%] bg-[#202c33] text-[#e9edef] rounded-lg overflow-hidden shadow-md flex flex-col border border-white/5">
                  <div className="aspect-[4/3] bg-black/20 relative">
                    <img 
                      src={`https://wsrv.nl/?url=${encodeURIComponent(`https://telocg.com/${p.image}`)}&w=300&output=webp&q=75`} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-[9px] px-1.5 py-0.5 rounded text-white/90">
                      Costo: RD$ {p.cost || '??'}
                    </div>
                  </div>
                  {p.originalText && (
                    <div className="p-2 text-[11px] leading-relaxed whitespace-pre-line border-t border-white/5 max-h-36 overflow-y-auto">
                      {p.originalText}
                    </div>
                  )}
                  <div className="px-2 pb-1.5 text-right">
                    <span className="text-[9px] text-[#8696a0]">{p.date.split(' ')[1] || '10:18 AM'}</span>
                  </div>
                </div>

                {/* System / AI process bubble */}
                <div className="max-w-[85%] bg-[#005c4b] text-[#e9edef] rounded-lg p-2.5 shadow-md border border-green-800/10 ml-auto flex flex-col gap-1">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-green-300 flex items-center gap-1">
                    <Check size={10} /> Extractor AI
                  </p>
                  <p className="font-semibold text-xs text-white">{p.title}</p>
                  <div className="flex items-center justify-between text-[11px] mt-1 border-t border-white/10 pt-1">
                    <span className="text-white/80">Costo: RD$ {p.cost}</span>
                    <span className="text-[#25D366] font-bold">Venta: RD$ {p.price}</span>
                  </div>
                  <div className="text-[9px] text-white/60 text-right mt-0.5">
                    Categoría: {p.category}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500 text-xs">
                No hay mensajes en esta vista
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editable Catalog Grid */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="whatsapp-products-grid">
            {filteredProducts.map((p) => {
              const isSelected = selectedIds.includes(p.id)
              return (
                <div 
                  key={p.id}
                  className={`bg-[var(--c-surface)] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col group ${
                    isSelected 
                      ? 'border-[var(--c-sales)] ring-1 ring-[var(--c-sales)] shadow-md shadow-orange-500/5' 
                      : 'border-[var(--c-border)] hover:border-[var(--c-sales)]/50'
                  }`}
                >
                  {/* Top Bar Checkbox & Title */}
                  <div className="p-3 border-b border-[var(--c-border)] flex items-start gap-3 bg-[var(--c-surface-2)]/50">
                    <button
                      onClick={() => handleToggleSelect(p.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected 
                          ? 'bg-[var(--c-sales)] border-[var(--c-sales)] text-white' 
                          : 'border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-sales)]'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={p.title}
                        onChange={e => handleEditProduct(p.id, 'title', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-[var(--c-border)] focus:border-[var(--c-sales)] focus:outline-none text-sm font-semibold text-[var(--c-text)] truncate py-0.5"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 flex gap-3 flex-1 min-w-0">
                    {/* Image thumb */}
                    <div className="w-20 h-20 bg-[var(--c-surface-2)] rounded-lg overflow-hidden shrink-0 border border-[var(--c-border)] relative">
                      <img
                        src={`https://wsrv.nl/?url=${encodeURIComponent(`https://telocg.com/${p.image}`)}&w=150&h=150&output=webp`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Form fields */}
                    <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-[var(--c-text-dim)] uppercase tracking-wider block mb-0.5">Costo (RD$)</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--c-text-dim)]">
                            <DollarSign size={10} />
                          </span>
                          <input
                            type="number"
                            value={p.cost || ''}
                            onChange={e => handleEditProduct(p.id, 'cost', parseInt(e.target.value, 10) || 0)}
                            className="w-full pl-5 pr-2 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded focus:outline-none focus:border-[var(--c-sales)] text-[var(--c-text)]"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-[var(--c-text-dim)] uppercase tracking-wider block mb-0.5">Venta (RD$)</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--c-text-dim)]">
                            <DollarSign size={10} />
                          </span>
                          <input
                            type="number"
                            value={p.price || ''}
                            onChange={e => handleEditProduct(p.id, 'price', parseInt(e.target.value, 10) || 0)}
                            className="w-full pl-5 pr-2 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded focus:outline-none focus:border-[var(--c-sales)] text-[var(--c-text)] font-semibold"
                          />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-[var(--c-text-dim)] uppercase tracking-wider block mb-0.5">Categoría</label>
                        <div className="relative">
                          <select
                            value={p.category}
                            onChange={e => handleEditProduct(p.id, 'category', e.target.value)}
                            className="w-full px-2 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded focus:outline-none focus:border-[var(--c-sales)] text-[var(--c-text)] appearance-none cursor-pointer"
                          >
                            <option value="Accesorios">Accesorios</option>
                            <option value="Audio">Audio</option>
                            <option value="Iluminación">Iluminación</option>
                            <option value="Mobiliario">Mobiliario</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="px-3 pb-3">
                    <textarea
                      value={p.description}
                      onChange={e => handleEditProduct(p.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded p-1.5 text-[11px] text-[var(--c-text-muted)] focus:outline-none focus:border-[var(--c-sales)] resize-none"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl text-[var(--c-text-muted)]">
              <Package size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron productos con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
