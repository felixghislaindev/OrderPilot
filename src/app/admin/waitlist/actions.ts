'use server'

import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { InviteEmail } from '@/emails/InviteEmail'
import { revalidatePath } from 'next/cache'

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function approveWaitlistEntry(id: string, email: string, restaurantName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const admin = createAdminClient()

  // Generate the magic invite link directly (gives us full email control)
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      data: { restaurant_name: restaurantName },
    },
  })

  if (linkError) {
    if (linkError.message.includes('already been registered')) {
      return { error: 'This email already has an account.' }
    }
    return { error: linkError.message }
  }

  const inviteUrl = linkData.properties.action_link

  // Send the branded email via Resend
  const { error: emailError } = await resend.emails.send({
    from: 'OrderPilot <onboarding@resend.dev>',
    to: email,
    subject: `You're approved — ${restaurantName}'s dashboard is ready`,
    react: InviteEmail({ restaurantName, inviteUrl, siteUrl }),
  })

  if (emailError) return { error: 'Failed to send invite email. Please try again.' }

  // Pre-create the restaurant record so they land on a working dashboard
  await admin.from('restaurants').insert({
    owner_id: linkData.user.id,
    name: restaurantName,
    timezone: 'Europe/London',
    platforms: ['uber_eats', 'deliveroo', 'just_eat', 'direct'],
  })

  // Mark as approved
  await admin.from('waitlist').update({ approved_at: new Date().toISOString() }).eq('id', id)

  revalidatePath('/admin/waitlist')
  return { success: true }
}
