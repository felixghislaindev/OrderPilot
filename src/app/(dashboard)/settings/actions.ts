'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SaveResult = { success: true } | { error: string }

export async function saveRestaurantSettings(
  _: SaveResult | null,
  formData: FormData
): Promise<SaveResult> {
  const name = (formData.get('name') as string)?.trim()
  const timezone = (formData.get('timezone') as string)?.trim()
  const platforms = formData.getAll('platforms') as string[]

  if (!name || !timezone) return { error: 'Name and timezone are required.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('restaurants')
    .update({ name, timezone, platforms })
    .eq('owner_id', user.id)

  if (error) return { error: 'Failed to save. Please try again.' }

  revalidatePath('/settings')
  return { success: true }
}
