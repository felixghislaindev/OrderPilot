'use client'

import { TrendingUp, TrendingDown, Zap, Clock, CheckCircle2 } from 'lucide-react'
import { mockAnalytics, mockOrders } from '@/lib/mock-data'
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
  const activeOrders = mockOrders.filter(
    o => !['delivered', 'cancelled'].includes(o.status)
  ).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Active Orders"
        value={String(activeOrders)}
        trendLabel="+3 from 1hr ago"
        trend="up"
        icon={<Zap className="w-4 h-4" />}
      />
      <MetricCard
        label="Revenue Today"
        value={formatCurrency(mockAnalytics.revenue)}
        trendLabel="+12.4%"
        sub="vs yesterday"
        trend="up"
        valueColor="text-emerald-400"
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <MetricCard
        label="Avg Prep Time"
        value={`${mockAnalytics.avg_prep_time_minutes} min`}
        trendLabel="−1.2 min"
        sub="vs last week"
        trend="up"
        icon={<Clock className="w-4 h-4" />}
      />
      <MetricCard
        label="On-Time Rate"
        value={`${mockAnalytics.on_time_rate}%`}
        trendLabel={`${mockAnalytics.total_orders} orders today`}
        trend="neutral"
        icon={<CheckCircle2 className="w-4 h-4" />}
      />
    </div>
  )
}
