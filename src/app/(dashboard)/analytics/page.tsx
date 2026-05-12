import { BarChart3 } from 'lucide-react'
import { AnalyticsStrip } from '@/components/dashboard/AnalyticsStrip'
import { mockAnalytics } from '@/lib/mock-data'
import { formatCurrency, getPlatformLabel } from '@/lib/utils'

export default function AnalyticsPage() {
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
        {/* Platform breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Platform Breakdown</h3>
          <div className="space-y-3">
            {mockAnalytics.platform_breakdown.map(p => {
              const share = Math.round((p.orders / mockAnalytics.total_orders) * 100)
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
        </div>

        {/* Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Today&apos;s Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Orders', value: String(mockAnalytics.total_orders) },
              { label: 'Total Revenue', value: formatCurrency(mockAnalytics.revenue) },
              { label: 'Avg Prep Time', value: `${mockAnalytics.avg_prep_time_minutes} min` },
              { label: 'On-Time Rate', value: `${mockAnalytics.on_time_rate}%` },
              { label: 'Cancelled', value: String(mockAnalytics.cancelled_orders) },
            ].map(({ label, value }) => (
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
