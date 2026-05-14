import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateApiKey } from '@/lib/api-keys'

// POST — generate a new API key for the current restaurant
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const name: string = body.name ?? 'Default'

  const admin = createAdminClient()
  const { data: restaurant } = await admin
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  const { key, hash, prefix } = generateApiKey()

  await admin.from('api_keys').insert({
    restaurant_id: restaurant.id,
    key_hash:      hash,
    key_prefix:    prefix,
    name,
  })

  // Return the full key ONCE — it is never retrievable again after this response
  return NextResponse.json({ key, prefix, name }, { status: 201 })
}

// GET — list existing keys (prefix only, never the full key)
export async function GET() {
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

  const { data: keys } = await admin
    .from('api_keys')
    .select('id, name, key_prefix, created_at, last_used_at, revoked_at')
    .eq('restaurant_id', restaurant.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ keys: keys ?? [] })
}

// DELETE — revoke a key by ID
export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { keyId } = await req.json()
  if (!keyId) return NextResponse.json({ error: 'Missing keyId' }, { status: 400 })

  const admin = createAdminClient()
  const { data: restaurant } = await admin
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  await admin
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', keyId)
    .eq('restaurant_id', restaurant.id) // ensure ownership

  return NextResponse.json({ success: true })
}
