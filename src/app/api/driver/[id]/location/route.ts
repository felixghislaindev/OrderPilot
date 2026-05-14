import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ACTIVE_STATUSES = ['confirmed', 'preparing', 'ready', 'picked_up']

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let lat: number, lng: number
  try {
    const body = await req.json()
    lat = Number(body.lat)
    lng = Number(body.lng)
    if (isNaN(lat) || isNaN(lng)) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verify order exists and is in a trackable state — UUID is the access token
  const { data: order } = await admin
    .from('orders')
    .select('id, status')
    .eq('id', id)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!ACTIVE_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: 'Order not active' }, { status: 409 })
  }

  await admin.from('orders').update({
    driver_lat:                 lat,
    driver_lng:                 lng,
    driver_location_updated_at: new Date().toISOString(),
  }).eq('id', id)

  return NextResponse.json({ ok: true })
}
