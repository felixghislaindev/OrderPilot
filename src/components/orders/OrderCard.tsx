'use client'

import { Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import type { Order, OrderStatus } from '@/types/orders'
import {
  cn,
  formatCurrency,
  formatOrderTime,
  getStatusColors,
  getPlatformColors,
  getPlatformLabel,
  getStatusLabel,
  minutesSince,
} from '@/lib/utils'

interface OrderCardProps {
  order: Order
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
  compact?: boolean
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'picked_up',
}

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Accept',
  confirmed: 'Start Prep',
  preparing: 'Mark Ready',
  ready: 'Picked Up',
}

export function OrderCard({ order, onStatusChange, compact = false }: OrderCardProps) {
  const nextStatus = NEXT_STATUS[order.status]
  const actionLabel = ACTION_LABEL[order.status]
  const elapsed = minutesSince(order.placed_at)
  const isOverdue =
    elapsed > order.estimated_prep_minutes &&
    !['delivered', 'cancelled', 'picked_up'].includes(order.status)

  const visibleItems = order.items.slice(0, compact ? 2 : 4)
  const hiddenCount = order.items.length - visibleItems.length

  return (
    <div
      className={cn(
        'bg-zinc-900 border rounded-xl flex flex-col overflow-hidden transition-colors',
        order.is_urgent
          ? 'border-amber-500/30 shadow-[0_0_0_1px_rgba(245,158,11,0.1)]'
          : isOverdue
            ? 'border-red-500/30'
            : 'border-zinc-800'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 min-w-0">
          {order.is_urgent && (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="text-sm font-semibold text-zinc-200">#{order.display_id}</span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border font-medium shrink-0',
              getPlatformColors(order.platform)
            )}
          >
            {getPlatformLabel(order.platform)}
          </span>
        </div>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full border font-medium shrink-0',
            getStatusColors(order.status)
          )}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800/30">
        <Clock className={cn('w-3 h-3 shrink-0', isOverdue ? 'text-red-400' : 'text-zinc-600')} />
        <span className={cn('text-xs', isOverdue ? 'text-red-400 font-medium' : 'text-zinc-500')}>
          {formatOrderTime(order.placed_at)}
          {isOverdue ? ' · Overdue' : ` · Est. ${order.estimated_prep_minutes} min`}
        </span>
        {order.customer_name && (
          <>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500 truncate">{order.customer_name}</span>
          </>
        )}
      </div>

      {/* Items */}
      <div className="px-4 py-3 flex-1">
        <div className="space-y-1.5">
          {visibleItems.map(item => (
            <div key={item.id} className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-zinc-300 truncate">
                <span className="text-zinc-500 font-medium mr-1.5">{item.quantity}×</span>
                {item.name}
              </span>
              <span className="text-xs text-zinc-500 shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
          {hiddenCount > 0 && (
            <p className="text-xs text-zinc-600">+{hiddenCount} more item{hiddenCount > 1 ? 's' : ''}</p>
          )}
        </div>
        {order.notes && (
          <div className="mt-2.5 px-2.5 py-1.5 bg-amber-500/5 border border-amber-500/15 rounded-md text-xs text-amber-300/80">
            {order.notes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/60 bg-zinc-900/50">
        <div>
          <span className="text-sm font-semibold text-zinc-200">{formatCurrency(order.total)}</span>
          {order.driver && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {order.driver.name}
              {order.driver.eta_minutes != null && ` · ${order.driver.eta_minutes} min ETA`}
            </p>
          )}
        </div>
        {actionLabel && nextStatus && onStatusChange && (
          <button
            onClick={() => onStatusChange(order.id, nextStatus)}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors"
          >
            {actionLabel}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
