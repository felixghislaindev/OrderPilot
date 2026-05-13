'use server'

import { createClient } from '@/lib/supabase/server'

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

  const supabase = await createClient()
  const { error } = await supabase
    .from('waitlist')
    .insert({ name, restaurant_name, email, platforms, orders_per_day })

  if (error) {
    if (error.code === '23505') return { error: 'This email is already on the waitlist.' }
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
