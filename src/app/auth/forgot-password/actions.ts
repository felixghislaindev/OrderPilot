'use server'

import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { ResetEmail } from '@/emails/ResetEmail'

const resend = new Resend(process.env.RESEND_API_KEY)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orderpilot.online'

export async function requestPasswordReset(email: string): Promise<{ success: true } | { error: string }> {
  const admin = createAdminClient()

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/reset-password`,
    },
  })

  if (linkError) {
    console.error('[reset] generateLink failed:', linkError.message)
    // Return success anyway — don't reveal whether the email exists
    return { success: true }
  }

  const { error: emailError } = await resend.emails.send({
    from: 'OrderPilot <hello@orderpilot.online>',
    to: email,
    subject: 'Reset your OrderPilot password',
    react: ResetEmail({ resetUrl: linkData.properties.action_link }),
  })

  if (emailError) {
    console.error('[reset] Resend failed:', emailError)
    return { error: 'Failed to send reset email. Please try again.' }
  }

  return { success: true }
}
