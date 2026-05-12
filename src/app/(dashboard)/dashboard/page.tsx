import { AnalyticsStrip } from '@/components/dashboard/AnalyticsStrip'
import { LiveOrderFeed } from '@/components/dashboard/LiveOrderFeed'
import { KitchenBoard } from '@/components/dashboard/KitchenBoard'
import { DeliveryTracker } from '@/components/dashboard/DeliveryTracker'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <AnalyticsStrip />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        <LiveOrderFeed />
        <DeliveryTracker />
      </div>
      <KitchenBoard />
    </div>
  )
}
