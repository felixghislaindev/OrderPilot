import { ChefHat } from 'lucide-react'
import { KitchenBoard } from '@/components/dashboard/KitchenBoard'

export default function KitchenPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <ChefHat className="w-5 h-5 text-zinc-400" />
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Kitchen Queue</h1>
          <p className="text-xs text-zinc-500">Real-time order preparation board</p>
        </div>
      </div>
      <KitchenBoard />
    </div>
  )
}
