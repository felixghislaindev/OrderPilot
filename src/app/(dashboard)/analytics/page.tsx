'use client'

import { BarChart3 } from 'lucide-react'
import { AnalyticsStrip } from '@/components/dashboard/AnalyticsStrip'
import { useOrders } from '@/contexts/OrdersContext'
import { formatCurrency, getPlatformLabel } from '@/lib/utils'
import type { Platform } from '@/types/orders'

const PLATFORMS: Platform[] = ['uber_eats', 'deliveroo', 'just_eat', 'direct']

export default function AnalyticsPage() {
  const { orders } = useOrders()

  const today = new Date().toDateString()
  const todayOrders = orders.filter(o => new Date(o.placed_at).toDateString() === today)

  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const cancelled = todayOrders.filter(o => o.status === 'cancelled').length

  const delivered = todayOrders.filter(
    o => o.status === 'delivered' && o.prep_started_at && o.ready_at
  )
  const avgPrepTime = delivered.length > 0
    ? Math.round(
        delivered.reduce((sum, o) => {
          return sum + (new Date(o.ready_at!).getTime() - new Date(o.prep_started_at!).getTime()) / 60000
        }, 0) / delivered.length
      )
    : null

  const onTime = delivered.filter(o => {
    const actual = (new Date(o.ready_at!).getTime() - new Date(o.prep_started_at!).getTime()) / 60000
    return actual <= o.estimated_prep_minutes
  })
  const onTimeRate = delivered.length > 0
    ? Math.round((onTime.length / delivered.length) * 100)
    : null

  const platformStats = PLATFORMS.map(platform => {
    const platformOrders = todayOrders.filter(o => o.platform === platform)
    return {
      platform,
      orders: platformOrders.length,
      revenue: platformOrders.reduce((sum, o) => sum + o.total, 0),
    }
  }).filter(p => p.orders > 0)

  const totalOrders = todayOrders.length

  const summary = [
    { label: 'Total Orders', value: String(totalOrders) },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue) },
    { label: 'Avg Prep Time', value: avgPrepTime != null ? `${avgPrepTime} min` : '—' },
    { label: 'On-Time Rate', value: onTimeRate != null ? `${onTimeRate}%` : '—' },
    { label: 'Cancelled', value: String(cancelled) },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-zinc-400" />
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Analytics</h1>
          <p className="text-xs text-zinc-500">Performance insights for today</p>
        </div>
      </div>

      <AnalyticsStrip />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Platform Breakdown</h3>
          {platformStats.length === 0 ? (
            <p className="text-xs text-zinc-600">No orders today yet.</p>
          ) : (
            <div className="space-y-3">
              {platformStats.map(p => {
                const share = totalOrders > 0 ? Math.round((p.orders / totalOrders) * 100) : 0
                return (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-zinc-300">{getPlatformLabel(p.platform)}</span>
                      <span className="text-xs text-zinc-500">{p.orders} orders · {formatCurrency(p.revenue)}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Today&apos;s Summary</h3>
          <div className="space-y-3">
            {summary.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-zinc-800/60 last:border-0">
                <span className="text-xs text-zinc-500">{label}</span>
                <span className="text-xs font-semibold text-zinc-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
