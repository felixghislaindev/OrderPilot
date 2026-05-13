'use client'

import { TrendingUp, TrendingDown, Zap, Clock, CheckCircle2 } from 'lucide-react'
import { useOrders } from '@/contexts/OrdersContext'
import { formatCurrency, cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  trendLabel: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  valueColor?: string
  icon: React.ReactNode
}

function MetricCard({ label, value, trendLabel, sub, trend = 'neutral', valueColor = 'text-zinc-50', icon }: MetricCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
        <span className="text-zinc-600">{icon}</span>
      </div>
      <div className={cn('text-2xl font-bold tracking-tight mb-1.5', valueColor)}>{value}</div>
      <div className="flex items-center gap-1.5">
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400 shrink-0" />}
        <span
          className={cn(
            'text-xs font-medium',
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'
          )}
        >
          {trendLabel}
        </span>
        {sub && <span className="text-xs text-zinc-600">{sub}</span>}
      </div>
    </div>
  )
}

export function AnalyticsStrip() {
  const { orders } = useOrders()

  const today = new Date().toDateString()
  const todayOrders = orders.filter(o => new Date(o.placed_at).toDateString() === today)
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0)

  const delivered = todayOrders.filter(o => o.status === 'delivered' && o.prep_started_at && o.ready_at)
  const avgPrepTime = delivered.length > 0
    ? Math.round(delivered.reduce((sum, o) => {
        const mins = (new Date(o.ready_at!).getTime() - new Date(o.prep_started_at!).getTime()) / 60000
        return sum + mins
      }, 0) / delivered.length)
    : null

  const onTime = delivered.filter(o => {
    const actual = (new Date(o.ready_at!).getTime() - new Date(o.prep_started_at!).getTime()) / 60000
    return actual <= o.estimated_prep_minutes
  })
  const onTimeRate = delivered.length > 0 ? Math.round((onTime.length / delivered.length) * 100) : null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Active Orders"
        value={String(activeOrders)}
        trendLabel={`${todayOrders.length} orders today`}
        trend="neutral"
        icon={<Zap className="w-4 h-4" />}
      />
      <MetricCard
        label="Revenue Today"
        value={formatCurrency(revenueToday)}
        trendLabel={`${todayOrders.length} orders`}
        trend="up"
        valueColor="text-emerald-400"
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <MetricCard
        label="Avg Prep Time"
        value={avgPrepTime != null ? `${avgPrepTime} min` : '—'}
        trendLabel={delivered.length > 0 ? `${delivered.length} completed` : 'No data yet'}
        trend="neutral"
        icon={<Clock className="w-4 h-4" />}
      />
      <MetricCard
        label="On-Time Rate"
        value={onTimeRate != null ? `${onTimeRate}%` : '—'}
        trendLabel={delivered.length > 0 ? `${onTime.length}/${delivered.length} on time` : 'No data yet'}
        trend="neutral"
        icon={<CheckCircle2 className="w-4 h-4" />}
      />
    </div>
  )
}
