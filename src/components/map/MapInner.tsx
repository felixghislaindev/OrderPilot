'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom driver marker — avoids Leaflet's broken default icon in webpack
const driverIcon = L.divIcon({
  html: `
    <div style="
      width:36px;height:36px;border-radius:50%;
      background:#6366f1;border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;
    ">🛵</div>
  `,
  className: '',
  iconSize:   [36, 36],
  iconAnchor: [18, 18],
})

function RecenterOnMove({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], map.getZoom()) }, [lat, lng, map])
  return null
}

export default function MapInner({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '240px', width: '100%', borderRadius: '12px' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[lat, lng]} icon={driverIcon} />
      <RecenterOnMove lat={lat} lng={lng} />
    </MapContainer>
  )
}
