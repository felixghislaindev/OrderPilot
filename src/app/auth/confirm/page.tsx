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

    async function handleInvite() {
      // PKCE flow — code in query string
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        router.replace(error ? '/login?error=invite_expired' : '/auth/set-password')
        return
      }

      // Implicit flow — tokens in URL hash (#access_token=...&refresh_token=...&type=invite|recovery)
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.slice(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          // Both invite and recovery flows need the user to set/reset their password
          router.replace(error ? '/login?error=invite_expired' : '/auth/set-password')
          return
        }
      }

      router.replace('/login?error=invite_expired')
    }

    handleInvite()
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
