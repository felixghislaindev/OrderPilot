'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Zap } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orderpilot.online'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
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
          {sent ? (
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-zinc-50 mb-2">Check your inbox</p>
              <p className="text-sm text-zinc-500 mb-6">
                We sent a password reset link to <span className="text-zinc-300">{email}</span>. It expires in 1 hour.
              </p>
              <Link href="/login" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-zinc-50 mb-1">Reset your password</h1>
              <p className="text-sm text-zinc-500 mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="chef@restaurant.com"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p className="text-center text-xs text-zinc-600 mt-4">
                <Link href="/login" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                  ← Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
