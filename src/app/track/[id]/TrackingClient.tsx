'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

export type TrackingStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'

interface StepData {
  status: TrackingStatus
  confirmed_at: string | null
  prep_started_at: string | null
  ready_at: string | null
  picked_up_at: string | null
  delivered_at: string | null
  estimated_prep_minutes: number
  driver_lat?: number | null
  driver_lng?: number | null
}

const STEPS: { key: TrackingStatus; label: string; description: string }[] = [
  { key: 'pending',   label: 'Order placed',    description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed',        description: 'Restaurant has accepted your order' },
  { key: 'preparing', label: 'Being prepared',   description: 'The kitchen is preparing your food' },
  { key: 'ready',     label: 'Ready',            description: 'Your order is ready for collection' },
  { key: 'picked_up', label: 'Out for delivery', description: 'Your order is on its way' },
  { key: 'delivered', label: 'Delivered',        description: 'Enjoy your meal!' },
]

const STATUS_INDEX: Record<TrackingStatus, number> = {
  pending:   0,
  confirmed: 1,
  preparing: 2,
  ready:     3,
  picked_up: 4,
  delivered: 5,
  cancelled: -1,
}

function formatTime(ts: string | null) {
  if (!ts) return null
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function getTimestamp(step: TrackingStatus, data: StepData): string | null {
  switch (step) {
    case 'confirmed': return formatTime(data.confirmed_at)
    case 'preparing': return formatTime(data.prep_started_at)
    case 'ready':     return formatTime(data.ready_at)
    case 'picked_up': return formatTime(data.picked_up_at)
    case 'delivered': return formatTime(data.delivered_at)
    default: return null
  }
}

export function TrackingClient({ orderId, initial }: { orderId: string; initial: StepData }) {
  const [data, setData] = useState<StepData>(initial)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/track/${orderId}`)
        if (res.ok) setData(await res.json())
      } catch {}
    }
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  if (data.status === 'cancelled') {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 font-medium">This order has been cancelled.</p>
        <p className="text-zinc-500 text-sm mt-1">Please contact the restaurant for assistance.</p>
      </div>
    )
  }

  const currentIndex = STATUS_INDEX[data.status] ?? 0

  return (
    <div className="space-y-1">
      {STEPS.map((step, i) => {
        const done   = i < currentIndex
        const active = i === currentIndex
        const ts      = getTimestamp(step.key, data)

        return (
          <div key={step.key} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                done   ? 'bg-indigo-500 text-white' :
                active ? 'bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400' :
                         'bg-zinc-800 border border-zinc-700 text-zinc-600'
            }`}>
                {done ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : active ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 ${done ? 'bg-indigo-500/40' : 'bg-zinc-800'}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-6 pt-0.5 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className={`text-sm font-medium ${
                  done || active ? 'text-zinc-100' : 'text-zinc-500'
                }`}>
                  {step.label}
                </p>
                {ts && <span className="text-xs text-zinc-500">{ts}</span>}
              </div>
              {(done || active) && (
                <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
