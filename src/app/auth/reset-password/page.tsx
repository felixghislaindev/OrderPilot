'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap } from 'lucide-react'

function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const code = searchParams.get('code')

    async function init() {
      // PKCE flow
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) setTokenError('This reset link has expired. Please request a new one.')
        else setReady(true)
        return
      }

      // Implicit flow — tokens in hash
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.slice(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          if (error) setTokenError('This reset link has expired. Please request a new one.')
          else setReady(true)
          return
        }
      }

      setTokenError('Invalid reset link. Please request a new one.')
    }

    init()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (password.length < 8) { setFormError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setFormError('Passwords do not match.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setFormError(error.message)
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold text-zinc-50">OrderPilot</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {tokenError ? (
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-zinc-50 mb-2">Link expired</p>
              <p className="text-sm text-zinc-500 mb-4">{tokenError}</p>
              <button
                onClick={() => router.replace('/auth/forgot-password')}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Request a new reset link →
              </button>
            </div>
          ) : !ready ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-zinc-500">Verifying reset link…</p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-zinc-50 mb-1">Set a new password</h1>
              <p className="text-sm text-zinc-500 mb-6">Choose a new password for your account.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {loading ? 'Saving…' : 'Update password →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPassword /></Suspense>
}
