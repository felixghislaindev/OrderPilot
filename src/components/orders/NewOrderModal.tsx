'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Item {
  name:     string
  quantity: number
  price:    string  // pounds, as user types e.g. "8.50"
}

interface NewOrderModalProps {
  onClose:   () => void
  onCreated: () => void
}

const emptyItem = (): Item => ({ name: '', quantity: 1, price: '' })

function pence(pounds: string): number {
  const n = parseFloat(pounds)
  return isNaN(n) ? 0 : Math.round(n * 100)
}

function formatTotal(items: Item[], deliveryFee: string): string {
  const subtotal = items.reduce((s, i) => s + pence(i.price) * i.quantity, 0)
  const fee      = pence(deliveryFee)
  return `£${((subtotal + fee) / 100).toFixed(2)}`
}

export function NewOrderModal({ onClose, onCreated }: NewOrderModalProps) {
  const [customerName, setCustomerName]     = useState('')
  const [customerPhone, setCustomerPhone]   = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes]                   = useState('')
  const [deliveryFee, setDeliveryFee]       = useState('')
  const [items, setItems]                   = useState<Item[]>([emptyItem()])
  const [submitting, setSubmitting]         = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstInputRef.current?.focus() }, [])

  const updateItem = (i: number, field: keyof Item, value: string | number) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const addItem = () => setItems(prev => [...prev, emptyItem()])

  const removeItem = (i: number) => {
    setItems(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validItems = items.filter(i => i.name.trim() && pence(i.price) > 0)
    if (!customerName.trim()) { setError('Customer name is required.'); return }
    if (validItems.length === 0) { setError('Add at least one item with a name and price.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name:    customerName.trim(),
          customer_phone:   customerPhone.trim() || undefined,
          delivery_address: deliveryAddress.trim() || undefined,
          notes:            notes.trim() || undefined,
          delivery_fee:     pence(deliveryFee) || undefined,
          items: validItems.map(i => ({
            name:     i.name.trim(),
            quantity: i.quantity,
            price:    pence(i.price),
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to create order.')
        return
      }

      onCreated()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">New Order</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Phone, walk-in or any manual order</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

            {/* Customer */}
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Customer</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Name *</label>
                  <input
                    ref={firstInputRef}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Phone</label>
                  <input
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+44 7700 000000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Items</p>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add item
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <input
                      value={item.name}
                      onChange={e => updateItem(i, 'name', e.target.value)}
                      placeholder="Item name"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-zinc-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">£</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.price}
                        onChange={e => updateItem(i, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-6 pr-2 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Delivery</p>
              <div className="space-y-2">
                <input
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Delivery address (leave blank for collection)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <div className="flex gap-2">
                  <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">£</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={deliveryFee}
                      onChange={e => setDeliveryFee(e.target.value)}
                      placeholder="Delivery fee"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-6 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Order notes"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500">Total</p>
              <p className="text-base font-bold text-zinc-100">{formatTotal(items, deliveryFee)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors',
                  submitting
                    ? 'bg-indigo-500/50 text-white/50 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                )}
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Creating…' : 'Create order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
