import { ClipboardList } from 'lucide-react'
import { LiveOrderFeed } from '@/components/dashboard/LiveOrderFeed'

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-5 h-5 text-zinc-400" />
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Orders</h1>
          <p className="text-xs text-zinc-500">Manage all incoming and active orders</p>
        </div>
      </div>
      <LiveOrderFeed />
    </div>
  )
}
