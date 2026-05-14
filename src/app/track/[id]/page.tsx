import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import { TrackingClient } from './TrackingClient'
import { Zap } from 'lucide-react'

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name')
    .eq('id', order.restaurant_id)
    .single()

  const items: { id: string; name: string; quantity: number; price: number }[] =
    (order as { order_items?: { id: string; name: string; quantity: number; price: number }[] }).order_items ?? []

  const placedAt = new Date(order.placed_at)
  const timeStr = placedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const dateStr = placedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  const initial = {
    status:                 order.status,
    confirmed_at:           order.confirmed_at,
    prep_started_at:        order.prep_started_at,
    ready_at:               order.ready_at,
    picked_up_at:           order.picked_up_at,
    delivered_at:           order.delivered_at,
    estimated_prep_minutes: order.estimated_prep_minutes,
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Order from</p>
            <p className="text-sm font-semibold text-zinc-100">{restaurant?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">

          {/* Order summary card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-zinc-500">Order</p>
                <p className="text-base font-bold text-zinc-100">#{order.display_id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">{dateStr} · {timeStr}</p>
                <p className="text-base font-bold text-zinc-100">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-3 space-y-1.5">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    <span className="text-zinc-500 mr-1.5">{item.quantity}×</span>
                    {item.name}
                  </span>
                  <span className="text-zinc-500">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {order.delivery_address && (
              <div className="border-t border-zinc-800 pt-3 mt-3">
                <p className="text-xs text-zinc-500 mb-0.5">Delivering to</p>
                <p className="text-sm text-zinc-300">{order.delivery_address}</p>
              </div>
            )}
          </div>

          {/* Live status tracker */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Live tracking</p>
            <TrackingClient orderId={id} initial={initial} />
          </div>

          <p className="text-center text-xs text-zinc-600">
            Updates automatically · Powered by OrderPilot
          </p>
        </div>
      </div>
    </div>
  )
}
