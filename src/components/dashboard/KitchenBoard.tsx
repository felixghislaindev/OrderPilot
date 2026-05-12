'use client'

import { useState } from 'react'
import type { Order, OrderStatus } from '@/types/orders'
import { mockOrders } from '@/lib/mock-data'
import { OrderCard } from '@/components/orders/OrderCard'
import { cn } from '@/lib/utils'

const COLUMNS: { statuses: OrderStatus[]; label: string; color: string }[] = [
  { statuses: ['pending', 'confirmed'], label: 'Incoming', color: 'text-blue-400' },
  { statuses: ['preparing'], label: 'Preparing', color: 'text-amber-400' },
  { statuses: ['ready'], label: 'Ready', color: 'text-green-400' },
]

export function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const activeCount = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  ).length

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-200">Kitchen Board</h2>
        <span className="text-xs text-zinc-500">{activeCount} active</span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-zinc-800 min-h-[200px]">
        {COLUMNS.map(({ statuses, label, color }) => {
          const colOrders = orders
            .filter(o => statuses.includes(o.status))
            .sort((a, b) => {
              if (a.is_urgent && !b.is_urgent) return -1
              if (!a.is_urgent && b.is_urgent) return 1
              return new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime()
            })

          return (
            <div key={label} className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className={cn('text-xs font-semibold uppercase tracking-wider', color)}>
                  {label}
                </span>
                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full tabular-nums">
                  {colOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {colOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-zinc-800">
                    <span className="text-xs text-zinc-700">Empty</span>
                  </div>
                ) : (
                  colOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
