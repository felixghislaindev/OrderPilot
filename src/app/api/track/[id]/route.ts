import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select('status, confirmed_at, prep_started_at, ready_at, picked_up_at, delivered_at, estimated_prep_minutes, driver_lat, driver_lng, driver_location_updated_at')
    .eq('id', id)
    .single()

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(order)
}
