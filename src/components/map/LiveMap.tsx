'use client'

import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr:     false,
  loading: () => (
    <div className="h-60 rounded-xl bg-zinc-800 animate-pulse flex items-center justify-center">
      <p className="text-zinc-600 text-xs">Loading map…</p>
    </div>
  ),
})

export function LiveMap({ lat, lng }: { lat: number; lng: number }) {
  return <MapInner lat={lat} lng={lng} />
}
