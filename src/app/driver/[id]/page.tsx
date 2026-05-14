import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import { DriverClient } from './DriverClient'
import { Zap, Package } from 'lucide-react'

export default async function DriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select('id, display_id, status, customer_name, delivery_address, total, estimated_prep_minutes, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: restaurant } = await admin
    .from('restaurants')
    .select('name')
    .eq('id', (order as { restaurant_id?: string }).restaurant_id ?? '')
    .single()

  const items: { id: string; name: string; quantity: number; price: number }[] =
    (order as { order_items?: { id: string; name: string; quantity: number; price: number }[] }).order_items ?? []

  const isClosed = ['delivered', 'cancelled'].includes(order.status)

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-sm mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Delivering for</p>
            <p className="text-sm font-semibold text-zinc-100">{restaurant?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-sm mx-auto space-y-5">

          {/* Order summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Package className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Order</p>
                <p className="text-lg font-bold text-zinc-100">#{order.display_id}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500">Total</p>
                <p className="text-base font-bold text-zinc-100">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    <span className="text-zinc-600 mr-1.5">{item.quantity}×</span>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {order.delivery_address && (
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-xs text-zinc-500 mb-1">Deliver to</p>
                <p className="text-sm font-medium text-zinc-200">{order.delivery_address}</p>
              </div>
            )}
          </div>

          {/* Driver tracking */}
          {isClosed ? (
            <div className="text-center py-6 text-zinc-500 text-sm">
              This order has been {order.status}. No tracking needed.
            </div>
          ) : (
            <DriverClient orderId={order.id} displayId={order.display_id} />
          )}

        </div>
      </div>
    </div>
  )
}
