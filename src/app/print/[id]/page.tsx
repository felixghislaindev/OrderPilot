import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency } from '@/lib/utils'
import { PrintTrigger } from './PrintTrigger'
import { QRCode } from '@/components/orders/QRCode'

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orderpilot.online'
  const driverUrl = `${siteUrl}/driver/${id}`
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

  const placedAt = new Date(order.placed_at)
  const dateStr = placedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = placedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const items: { id: string; name: string; quantity: number; price: number; notes: string | null }[] =
    (order as { order_items?: { id: string; name: string; quantity: number; price: number; notes: string | null }[] }).order_items ?? []

  return (
    <>
      <PrintTrigger />

      {/* Screen: prompt to print */}
      <div className="print:hidden fixed inset-0 flex items-center justify-center bg-zinc-950">
        <div className="text-center space-y-4">
          <p className="text-zinc-400 text-sm">Receipt ready for order <span className="text-zinc-200 font-semibold">#{order.display_id}</span></p>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Print receipt
          </button>
          <p className="text-zinc-600 text-xs">or close this tab to go back</p>
        </div>
      </div>

      {/* Print output — hidden on screen, visible only when printing */}
      <div className="hidden print:block receipt">
        <style>{`
          @page { size: 80mm auto; margin: 6mm; }
          @media print {
            body { background: white !important; }
            .receipt { font-family: 'Courier New', monospace; font-size: 12px; color: #000; width: 100%; }
          }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>⚡ OrderPilot</div>
          <div style={{ fontWeight: 'bold', fontSize: 14, marginTop: 2 }}>{restaurant?.name}</div>
          <div style={{ marginTop: 6, borderTop: '1px dashed #000', paddingTop: 6 }}>
            <div style={{ fontWeight: 'bold' }}>ORDER #{order.display_id}</div>
            <div style={{ fontSize: 11, marginTop: 2 }}>{dateStr} · {timeStr}</div>
          </div>
        </div>

        {/* Items */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: 8, marginBottom: 8 }}>
          {items.map(item => (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.quantity}× {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
              {item.notes && (
                <div style={{ fontSize: 10, paddingLeft: 12, color: '#444' }}>↳ {item.notes}</div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: 8, marginBottom: 8 }}>
          {order.delivery_fee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
          )}
          {order.delivery_fee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span>Delivery</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 14, marginTop: 4 }}>
            <span>TOTAL</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Customer */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: 8, marginBottom: 8, fontSize: 11 }}>
          <div><strong>Customer:</strong> {order.customer_name}</div>
          {order.customer_phone && <div><strong>Phone:</strong> {order.customer_phone}</div>}
          {order.delivery_address && (
            <div style={{ marginTop: 4 }}>
              <strong>Deliver to:</strong>
              <div>{order.delivery_address}</div>
            </div>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div style={{ borderTop: '1px dashed #000', paddingTop: 8, marginBottom: 8, fontSize: 11 }}>
            <strong>Notes:</strong> {order.notes}
          </div>
        )}

        {/* Driver QR code */}
        <div style={{ borderTop: '1px dashed #000', paddingTop: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 10, marginBottom: 6, fontWeight: 'bold' }}>DRIVER — Scan to share location</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCode value={driverUrl} size={96} />
          </div>
          <div style={{ fontSize: 9, marginTop: 4, color: '#555', wordBreak: 'break-all' }}>{driverUrl}</div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px dashed #000', marginTop: 8, paddingTop: 8, textAlign: 'center', fontSize: 10 }}>
          <div>Thank you for your order</div>
          <div style={{ marginTop: 2, color: '#666' }}>Powered by OrderPilot</div>
        </div>
      </div>
    </>
  )
}
