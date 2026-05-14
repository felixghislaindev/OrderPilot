'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Wifi, WifiOff, Navigation } from 'lucide-react'

type Phase = 'idle' | 'requesting' | 'tracking' | 'denied' | 'error'

export function DriverClient({ orderId, displayId }: { orderId: string; displayId: string }) {
  const [phase, setPhase]       = useState<Phase>('idle')
  const [lastSent, setLastSent] = useState<Date | null>(null)
  const watchRef                = useRef<number | null>(null)
  const lastSendRef             = useRef<number>(0)

  const sendLocation = async (lat: number, lng: number) => {
    const now = Date.now()
    // Throttle — send at most every 5 seconds
    if (now - lastSendRef.current < 5000) return
    lastSendRef.current = now

    try {
      await fetch(`/api/driver/${orderId}/location`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ lat, lng }),
      })
      setLastSent(new Date())
    } catch {}
  }

  const startTracking = () => {
    if (!navigator.geolocation) { setPhase('error'); return }
    setPhase('requesting')

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPhase('tracking')
        sendLocation(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setPhase('denied')
        else setPhase('error')
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )
  }

  const stopTracking = () => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current)
      watchRef.current = null
    }
    setPhase('idle')
    setLastSent(null)
  }

  useEffect(() => () => { if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current) }, [])

  return (
    <div className="space-y-6">
      {/* Status indicator */}
      <div className={`rounded-2xl p-5 border text-center ${
        phase === 'tracking'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : phase === 'denied' || phase === 'error'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-zinc-800/60 border-zinc-700'
      }`}>
        {phase === 'tracking' ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-semibold">Sharing location</p>
            {lastSent && (
              <p className="text-emerald-400/60 text-xs mt-1">
                Last update {lastSent.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </>
        ) : phase === 'requesting' ? (
          <>
            <Navigation className="w-5 h-5 text-zinc-400 mx-auto mb-2 animate-pulse" />
            <p className="text-zinc-300 font-medium">Getting location…</p>
            <p className="text-zinc-500 text-xs mt-1">Allow location access when prompted</p>
          </>
        ) : phase === 'denied' ? (
          <>
            <WifiOff className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-medium">Location access denied</p>
            <p className="text-red-400/70 text-xs mt-1">Go to your browser settings and allow location for this site</p>
          </>
        ) : phase === 'error' ? (
          <>
            <WifiOff className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-medium">Could not get location</p>
            <p className="text-red-400/70 text-xs mt-1">Make sure GPS is enabled on your device</p>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <p className="text-zinc-400 font-medium">Location not sharing</p>
            <p className="text-zinc-600 text-xs mt-1">Tap the button below to start</p>
          </>
        )}
      </div>

      {/* Action button */}
      {phase === 'tracking' ? (
        <button
          onClick={stopTracking}
          className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-base hover:bg-red-500/20 transition-colors"
        >
          Stop sharing
        </button>
      ) : (
        <button
          onClick={startTracking}
          disabled={phase === 'requesting'}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold text-base transition-colors"
        >
          {phase === 'requesting' ? 'Getting location…' : 'Start sharing location'}
        </button>
      )}

      {/* Keep screen on tip */}
      {phase === 'tracking' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <p className="text-amber-300/80 text-xs text-center">
            Keep this screen open while delivering — locking your phone will pause location sharing
          </p>
        </div>
      )}

      <p className="text-center text-zinc-600 text-xs">
        Order #{displayId} · Powered by OrderPilot
      </p>
    </div>
  )
}
