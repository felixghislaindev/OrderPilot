import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orderpilot.online'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const admin = createAdminClient()
  const { data: restaurant } = await admin
    .from('restaurants')
    .select('id, name, stripe_customer_id, stripe_subscription_id, subscription_status')
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })

  // Already has an active subscription — send to billing portal instead
  if (
    restaurant.stripe_customer_id &&
    ['active', 'trialing'].includes(restaurant.subscription_status)
  ) {
    const portal = await getStripe().billingPortal.sessions.create({
      customer:   restaurant.stripe_customer_id,
      return_url: `${siteUrl}/dashboard`,
    })
    return NextResponse.json({ url: portal.url })
  }

  // Reuse or create Stripe customer
  let customerId = restaurant.stripe_customer_id ?? undefined
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email:    user.email,
      name:     restaurant.name,
      metadata: { restaurantId: restaurant.id },
    })
    customerId = customer.id
  }

  const session = await getStripe().checkout.sessions.create({
    customer:             customerId,
    mode:                 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price:    process.env.STRIPE_PRICE_ID!,
      quantity: 1,
    }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { restaurantId: restaurant.id },
    },
    metadata: { restaurantId: restaurant.id },
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url:  `${siteUrl}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
