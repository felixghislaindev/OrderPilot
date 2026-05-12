'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { Order } from '@/types/orders'
import { mockOrders } from '@/lib/mock-data'
import { cn, getPlatformColors, getPlatformLabel, formatCurrency } from '@/lib/utils'

export function DeliveryTracker() {
  const [orders] = useState<Order[]>(mockOrders)

  const active = orders.filter(o => ['picked_up', 'ready'].includes(o.status))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-200">Active Deliveries</h2>
        <span className="text-xs text-zinc-500">{active.length} en route</span>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {active.length === 0 ? (
          <div className="flex items-center justify-center h-24 px-4">
            <span className="text-xs text-zinc-600">No active deliveries</span>
          </div>
        ) : (
          active.map(order => (
            <div key={order.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-200">#{order.display_id}</span>
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded border font-medium',
                      getPlatformColors(order.platform)
                    )}
                  >
                    {getPlatformLabel(order.platform)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-zinc-300">
                  {formatCurrency(order.total)}
                </span>
              </div>

              {order.driver && (
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-indigo-400">
                        {order.driver.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">{order.driver.name}</span>
                  </div>
                  {order.driver.eta_minutes != null && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500 ml-auto">
                      <Clock className="w-3 h-3" />
                      <span>{order.driver.eta_minutes} min</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    order.status === 'picked_up' ? 'bg-purple-400' : 'bg-green-400'
                  )}
                />
                <span className="text-xs text-zinc-500">
                  {order.status === 'picked_up' ? 'In transit' : 'Awaiting driver'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
