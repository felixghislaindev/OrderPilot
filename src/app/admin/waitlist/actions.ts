'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveWaitlistEntry(id: string, email: string, restaurantName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const admin = createAdminClient()

  // Invite the user — creates account + sends magic link email in one call
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { restaurant_name: restaurantName },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
  })

  if (inviteError) {
    if (inviteError.message.includes('already been registered')) {
      return { error: 'This email already has an account.' }
    }
    return { error: inviteError.message }
  }

  // Pre-create the restaurant record so they land on a working dashboard
  await admin.from('restaurants').insert({
    owner_id: invited.user.id,
    name: restaurantName,
    timezone: 'Europe/London',
    platforms: ['uber_eats', 'deliveroo', 'just_eat', 'direct'],
  })

  // Mark as approved in the waitlist table
  await admin.from('waitlist').update({ approved_at: new Date().toISOString() }).eq('id', id)

  revalidatePath('/admin/waitlist')
  return { success: true }
}
