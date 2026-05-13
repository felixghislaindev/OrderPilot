'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Handles invite links: /auth/confirm#access_token=...&type=invite
// Exchanges the token then routes to set-password (invite) or dashboard (magic link).
export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const hash = window.location.hash
    const isInvite = hash.includes('type=invite')

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(isInvite ? '/auth/set-password' : '/dashboard')
      } else {
        router.replace('/login?error=invite_expired')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-500">Verifying your invite…</p>
      </div>
    </div>
  )
}
