import { Settings } from 'lucide-react'
import { mockRestaurant } from '@/lib/mock-data'
import { getPlatformLabel } from '@/lib/utils'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-zinc-400" />
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Settings</h1>
          <p className="text-xs text-zinc-500">Restaurant configuration</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-4">Restaurant Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1.5">Restaurant Name</label>
            <input
              defaultValue={mockRestaurant.name}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1.5">Timezone</label>
            <input
              defaultValue={mockRestaurant.timezone}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-2">Active Platforms</label>
            <div className="flex flex-wrap gap-2">
              {mockRestaurant.platforms.map(p => (
                <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {getPlatformLabel(p)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-zinc-800">
          <button className="text-xs font-medium px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
