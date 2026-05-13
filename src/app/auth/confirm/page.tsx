'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthConfirm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? ''

    async function exchange() {
      if (code) {
        // PKCE flow — exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace('/login?error=invite_expired')
          return
        }
      }
      // Implicit flow — getSession() parses the hash automatically
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace(next === 'set-password' ? '/auth/set-password' : '/dashboard')
      } else {
        router.replace('/login?error=invite_expired')
      }
    }

    exchange()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-500">Verifying your invite…</p>
      </div>
    </div>
  )
}

export default function AuthConfirmPage() {
  return (
    <Suspense>
      <AuthConfirm />
    </Suspense>
  )
}
