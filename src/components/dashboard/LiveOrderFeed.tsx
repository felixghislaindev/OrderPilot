'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/types/orders'
import { mockOrders } from '@/lib/mock-data'
import { OrderCard } from '@/components/orders/OrderCard'
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
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filter, setFilter] = useState<FilterValue>('active')

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const filtered = orders
    .filter(o => {
      if (filter === 'all') return true
      if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status)
      return o.status === filter
    })
    .sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime())

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-200 shrink-0">Live Orders</h2>
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

      {filtered.length === 0 ? (
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
  )
}
