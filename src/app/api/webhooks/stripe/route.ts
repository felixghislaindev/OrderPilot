import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

// Stripe sends raw body — must NOT use Next.js JSON body parsing
export const dynamic = 'force-dynamic'

const SUBSCRIPTION_STATUS_MAP: Record<string, string> = {
  trialing:   'trialing',
  active:     'active',
  past_due:   'past_due',
  canceled:   'cancelled',
  incomplete: 'incomplete',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Idempotency — skip if already processed
  const { data: existing } = await admin
    .from('stripe_events')
    .select('id')
    .eq('event_id', event.id)
    .single()

  if (existing) return NextResponse.json({ received: true })

  // Record event before processing to prevent duplicates on retry
  await admin.from('stripe_events').insert({ event_id: event.id, type: event.type })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const restaurantId = session.metadata?.restaurantId
        if (!restaurantId) break

        await admin.from('restaurants').update({
          stripe_customer_id:     session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status:    session.status === 'complete' ? 'active' : 'trialing',
        }).eq('id', restaurantId)

        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const status = SUBSCRIPTION_STATUS_MAP[sub.status] ?? sub.status

        await admin.from('restaurants').update({
          subscription_status: status,
        }).eq('stripe_subscription_id', sub.id)

        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        await admin.from('restaurants').update({
          subscription_status:    'cancelled',
          stripe_subscription_id: null,
        }).eq('stripe_subscription_id', sub.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Stripe v22: subscription is nested under invoice.parent.subscription_details
        const subRef = invoice.parent?.subscription_details?.subscription
        const subId = typeof subRef === 'string' ? subRef : subRef?.id

        if (subId) {
          await admin.from('restaurants').update({
            subscription_status: 'past_due',
          }).eq('stripe_subscription_id', subId)
        }

        break
      }
    }
  } catch (err) {
    console.error(`[stripe webhook] handler failed for ${event.type}:`, err)
    // Return 200 anyway — Stripe already recorded the event, no point retrying
  }

  return NextResponse.json({ received: true })
}
