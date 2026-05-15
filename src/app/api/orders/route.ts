import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface ManualItem {
  name:     string
  quantity: number
  price:    number  // pence
}

interface ManualOrderBody {
  customer_name:     string
  customer_phone?:   string
  items:             ManualItem[]
  delivery_fee?:     number  // pence
  delivery_address?: string
  notes?:            string
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const admin = createAdminClient()
  const { data: restaurant } = await admin
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  let body: ManualOrderBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { customer_name, items } = body
  if (!customer_name?.trim() || !items?.length) {
    return NextResponse.json({ error: 'customer_name and at least one item are required' }, { status: 422 })
  }

  const subtotal     = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const delivery_fee = body.delivery_fee ?? 0
  const total        = subtotal + delivery_fee
  const displayId    = `M${Date.now().toString().slice(-6)}`

  const { data: order, error: orderErr } = await admin
    .from('orders')
    .insert({
      restaurant_id:          restaurant.id,
      display_id:             displayId,
      platform:               'direct',
      status:                 'pending',
      customer_name:          customer_name.trim(),
      customer_phone:         body.customer_phone?.trim() || null,
      subtotal,
      delivery_fee,
      total,
      delivery_address:       body.delivery_address?.trim() || null,
      notes:                  body.notes?.trim() || null,
      estimated_prep_minutes: 15,
    })
    .select('id, display_id')
    .single()

  if (orderErr || !order) {
    console.error('[manual order] insert failed:', orderErr)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  const { error: itemsErr } = await admin.from('order_items').insert(
    items.map(i => ({
      order_id: order.id,
      name:     i.name.trim(),
      quantity: i.quantity,
      price:    i.price,
    }))
  )
  if (itemsErr) console.error('[manual order] items insert failed:', itemsErr)

  return NextResponse.json({ success: true, order_id: order.id, display_id: order.display_id }, { status: 201 })
}
