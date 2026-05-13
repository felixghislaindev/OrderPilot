'use server'

import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { InviteEmail } from '@/emails/InviteEmail'
import { revalidatePath } from 'next/cache'

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function generateAndSend(email: string, restaurantName: string) {
  const admin = createAdminClient()

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/confirm`,
      data: { restaurant_name: restaurantName },
    },
  })

  if (linkError) return { error: linkError.message }

  const inviteUrl = linkData.properties.action_link
  const toAddress = process.env.RESEND_TO_OVERRIDE ?? email

  const { error: emailError } = await resend.emails.send({
    from: 'OrderPilot <hello@orderpilot.online>',
    to: toAddress,
    subject: `You're approved — ${restaurantName}'s dashboard is ready`,
    react: InviteEmail({ restaurantName, inviteUrl, siteUrl }),
  })

  if (emailError) {
    console.error('[admin] Resend failed:', emailError)
    return { error: 'Failed to send invite email. Please try again.' }
  }

  return { userId: linkData.user.id }
}

export async function approveWaitlistEntry(id: string, email: string, restaurantName: string) {
  if (!(await requireAuth())) return { error: 'Not authenticated.' }

  const result = await generateAndSend(email, restaurantName)
  if ('error' in result) {
    if (result.error?.includes('already been registered')) {
      return { error: 'This email already has an account.' }
    }
    return result
  }

  const admin = createAdminClient()

  await admin.from('restaurants').insert({
    owner_id: result.userId,
    name: restaurantName,
    timezone: 'Europe/London',
    platforms: ['uber_eats', 'deliveroo', 'just_eat', 'direct'],
  })

  await admin
    .from('waitlist')
    .update({ approved_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin/waitlist')
  return { success: true }
}

export async function resendInvite(id: string, email: string, restaurantName: string) {
  if (!(await requireAuth())) return { error: 'Not authenticated.' }

  const result = await generateAndSend(email, restaurantName)
  if ('error' in result) return result

  const admin = createAdminClient()
  await admin
    .from('waitlist')
    .update({ invite_resent_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/admin/waitlist')
  return { success: true }
}
