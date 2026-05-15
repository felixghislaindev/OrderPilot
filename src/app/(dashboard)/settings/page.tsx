'use client'

import { useActionState } from 'react'
import { Settings, Loader2, CheckCircle2 } from 'lucide-react'
import { useOrders } from '@/contexts/OrdersContext'
import { getPlatformLabel } from '@/lib/utils'
import { saveRestaurantSettings, type SaveResult } from './actions'
import type { Platform } from '@/types/orders'
import { cn } from '@/lib/utils'
import { ApiKeyPanel } from '@/components/settings/ApiKeyPanel'

const ALL_PLATFORMS: Platform[] = ['uber_eats', 'deliveroo', 'just_eat', 'direct']

const TIMEZONES = [
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Asia/Dubai',
]

export default function SettingsPage() {
  const { restaurant } = useOrders()
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(
    saveRestaurantSettings,
    null
  )

  if (!restaurant) return null

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-zinc-400" />
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Settings</h1>
          <p className="text-xs text-zinc-500">Restaurant configuration</p>
        </div>
      </div>

      <form action={action}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Restaurant Profile</h2>

          {state && 'error' in state && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              {state.error}
            </div>
          )}
          {state && 'success' in state && (
            <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Changes saved successfully.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1.5">
                Restaurant Name
              </label>
              <input
                name="name"
                defaultValue={restaurant.name}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1.5">
                Timezone
              </label>
              <select
                name="timezone"
                defaultValue={restaurant.timezone}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-2">
                Active Platforms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_PLATFORMS.map(p => (
                  <label
                    key={p}
                    className="flex items-center gap-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="platforms"
                      value={p}
                      defaultChecked={restaurant.platforms.includes(p)}
                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                    />
                    <span className="text-xs font-medium text-zinc-300">
                      {getPlatformLabel(p)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={pending}
              className={cn(
                'flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-colors',
                pending
                  ? 'bg-indigo-500/50 text-white/50 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              )}
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {pending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      <ApiKeyPanel />
    </div>
  )
}
