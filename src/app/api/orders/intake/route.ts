import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashApiKey } from '@/lib/api-keys'

interface IntakeItem {
  name:     string
  quantity: number
  price:    number  // pence
  notes?:   string
}

interface IntakeBody {
  external_ref?:     string   // your order ID — used for deduplication
  customer_name:     string
  customer_phone?:   string
  items:             IntakeItem[]
  subtotal:          number   // pence
  delivery_fee?:     number   // pence
  total:             number   // pence
  delivery_address?: string
  notes?:            string
}

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') ?? ''
  const key = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

  if (!key) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
  }

  const admin = createAdminClient()
  const keyHash = hashApiKey(key)

  const { data: apiKey } = await admin
    .from('api_keys')
    .select('id, restaurant_id, revoked_at')
    .eq('key_hash', keyHash)
    .single()

  if (!apiKey || apiKey.revoked_at) {
    return NextResponse.json({ error: 'Invalid or revoked API key' }, { status: 401 })
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: IntakeBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { customer_name, items, subtotal, total } = body
  if (!customer_name || !items?.length || subtotal == null || total == null) {
    return NextResponse.json({ error: 'Missing required fields: customer_name, items, subtotal, total' }, { status: 422 })
  }

  const restaurantId = apiKey.restaurant_id

  // ── Deduplication ───────────────────────────────────────────────────────────
  if (body.external_ref) {
    const { data: duplicate } = await admin
      .from('orders')
      .select('id, display_id')
      .eq('restaurant_id', restaurantId)
      .eq('external_ref', body.external_ref)
      .single()

    if (duplicate) {
      return NextResponse.json({ success: true, order_id: duplicate.id, display_id: duplicate.display_id, duplicate: true })
    }
  }

  // ── Create order ────────────────────────────────────────────────────────────
  const displayId = `D${Date.now().toString().slice(-6)}`

  const { data: order, error: orderErr } = await admin
    .from('orders')
    .insert({
      restaurant_id:    restaurantId,
      display_id:       displayId,
      platform:         'direct',
      status:           'pending',
      customer_name:    body.customer_name,
      customer_phone:   body.customer_phone ?? null,
      subtotal:         body.subtotal,
      delivery_fee:     body.delivery_fee ?? 0,
      total:            body.total,
      delivery_address: body.delivery_address ?? null,
      notes:            body.notes ?? null,
      external_ref:     body.external_ref ?? null,
      estimated_prep_minutes: 15,
    })
    .select('id, display_id')
    .single()

  if (orderErr || !order) {
    console.error('[intake] order insert failed:', orderErr)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // ── Create order items ──────────────────────────────────────────────────────
  const orderItems = items.map((item) => ({
    order_id: order.id,
    name:     item.name,
    quantity: item.quantity,
    price:    item.price,
    notes:    item.notes ?? null,
  }))

  const { error: itemsErr } = await admin.from('order_items').insert(orderItems)
  if (itemsErr) {
    console.error('[intake] order_items insert failed:', itemsErr)
    // Order created — don't fail the response, items are non-critical for display
  }

  // ── Update key last_used_at ─────────────────────────────────────────────────
  await admin.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', apiKey.id)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orderpilot.online'
  return NextResponse.json({
    success:      true,
    order_id:     order.id,
    display_id:   order.display_id,
    tracking_url: `${siteUrl}/track/${order.id}`,
  }, { status: 201 })
}
