'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Wire up Supabase auth here when ready
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  }

  const handleDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold text-zinc-50 tracking-tight">OrderPilot</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-lg font-semibold text-zinc-50 mb-1">Sign in</h1>
          <p className="text-sm text-zinc-500 mb-6">Welcome back to your operations dashboard</p>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-zinc-900 text-xs text-zinc-600">or</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border border-zinc-700"
          >
            Continue as Demo
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          No account? <span className="text-zinc-400">Request access</span>
        </p>
      </div>
    </div>
  )
}
