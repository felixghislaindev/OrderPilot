'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { OrderStatus } from '@/types/orders'
import { useOrders } from '@/contexts/OrdersContext'
import { OrderCard } from '@/components/orders/OrderCard'
import { NewOrderModal } from '@/components/orders/NewOrderModal'
import { cn } from '@/lib/utils'

type FilterValue = OrderStatus | 'active' | 'all'

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Active', value: 'active' },
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Delivered', value: 'delivered' },
]

export function LiveOrderFeed() {
  const { orders, handleStatusChange, loading } = useOrders()
  const [filter, setFilter] = useState<FilterValue>('active')
  const [showNewOrder, setShowNewOrder] = useState(false)

  const filtered = orders
    .filter(o => {
      if (filter === 'all') return true
      if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status)
      return o.status === filter
    })
    .sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime())

  return (
    <>
    {showNewOrder && (
      <NewOrderModal
        onClose={() => setShowNewOrder(false)}
        onCreated={() => setShowNewOrder(false)}
      />
    )}
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-200 shrink-0">Live Orders</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewOrder(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New order
          </button>
        <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 overflow-x-auto">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap',
                filter === value
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
          <span className="text-sm text-zinc-600">Loading orders…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
          <span className="text-sm text-zinc-600">No orders to show</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
    </>
  )
}
