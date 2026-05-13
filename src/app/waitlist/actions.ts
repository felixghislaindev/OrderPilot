'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { InviteEmail } from '@/emails/InviteEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
// 0 = send immediately; set a positive number in production to add a delay
// (future: a cron job will pick up unsent entries and send after this many minutes)
const INVITE_DELAY_MINUTES = parseInt(process.env.INVITE_DELAY_MINUTES ?? '0', 10)

export type WaitlistResult =
  | { success: true }
  | { error: string }

export async function joinWaitlist(_: WaitlistResult | null, formData: FormData): Promise<WaitlistResult> {
  const name = (formData.get('name') as string)?.trim()
  const restaurant_name = (formData.get('restaurant_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const platforms = formData.getAll('platforms') as string[]
  const orders_per_day = (formData.get('orders_per_day') as string)?.trim() || null

  if (!name || !restaurant_name || !email) {
    return { error: 'Please fill in all required fields.' }
  }

  const id = crypto.randomUUID()

  // Use anon client for the public insert (RLS allows INSERT but not SELECT)
  const supabase = await createClient()
  const { error: insertError } = await supabase
    .from('waitlist')
    .insert({ id, name, restaurant_name, email, platforms, orders_per_day })

  if (insertError) {
    if (insertError.code === '23505') return { error: 'This email is already on the waitlist.' }
    return { error: 'Something went wrong. Please try again.' }
  }

  if (INVITE_DELAY_MINUTES === 0) {
    const inviteError = await sendInvite({ id, email, restaurant_name })
    if (inviteError) return { error: inviteError }
  }

  return { success: true }
}

// Returns an error string on failure, undefined on success
async function sendInvite({
  id,
  email,
  restaurant_name,
}: {
  id: string
  email: string
  restaurant_name: string
}): Promise<string | undefined> {
  const admin = createAdminClient()

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/confirm?next=set-password`,
      data: { restaurant_name },
    },
  })

  if (linkError) {
    console.error('[waitlist] generateLink failed:', linkError.message)
    if (linkError.message.includes('already been registered')) {
      return 'This email already has an OrderPilot account.'
    }
    return 'Failed to generate invite link. Please try again.'
  }

  const inviteUrl = linkData.properties.action_link
  const toAddress = process.env.RESEND_TO_OVERRIDE ?? email

  const { error: emailError } = await resend.emails.send({
    from: 'OrderPilot <hello@orderpilot.online>',
    to: toAddress,
    subject: `You're approved — ${restaurant_name}'s dashboard is ready`,
    react: InviteEmail({ restaurantName: restaurant_name, inviteUrl, siteUrl }),
  })

  if (emailError) {
    console.error('[waitlist] Resend failed:', JSON.stringify(emailError))
    return 'Failed to send invite email. Please try again.'
  }

  // Pre-create the restaurant so they land on a working dashboard
  await admin.from('restaurants').insert({
    owner_id: linkData.user.id,
    name: restaurant_name,
    timezone: 'Europe/London',
    platforms: ['uber_eats', 'deliveroo', 'just_eat', 'direct'],
  })

  await admin
    .from('waitlist')
    .update({ approved_at: new Date().toISOString() })
    .eq('id', id)
}
