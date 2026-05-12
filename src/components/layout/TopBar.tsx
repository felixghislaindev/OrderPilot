'use client'

import { useState, useEffect } from 'react'
import { Bell, Search } from 'lucide-react'
import { format } from 'date-fns'
import { mockOrders } from '@/lib/mock-data'

export function TopBar() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingCount = mockOrders.filter(o => o.status === 'pending').length

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-medium">Live</span>
        </div>
        <span className="text-zinc-700">·</span>
        {time && (
          <>
            <span className="text-xs text-zinc-500">{format(time, 'EEE d MMM')}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs font-mono text-zinc-400 tabular-nums">{format(time, 'HH:mm:ss')}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-md hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative p-2 rounded-md hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200">
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
