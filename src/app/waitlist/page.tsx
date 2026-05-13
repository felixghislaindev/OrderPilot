'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { joinWaitlist, type WaitlistResult } from './actions'
import { cn } from '@/lib/utils'

const PLATFORMS = [
  { id: 'uber_eats', label: 'Uber Eats' },
  { id: 'deliveroo', label: 'Deliveroo' },
  { id: 'just_eat', label: 'Just Eat' },
  { id: 'direct', label: 'Direct Orders' },
]

const ORDER_RANGES = ['Under 30', '30–80', '80–150', '150+']

export default function WaitlistPage() {
  const [state, action, pending] = useActionState<WaitlistResult | null, FormData>(joinWaitlist, null)

  if (state && 'success' in state) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-zinc-50 mb-2">You&apos;re on the list</h1>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            We&apos;ll reach out personally within 24 hours to get your kitchen set up.
            In the meantime, feel free to explore the dashboard.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold text-zinc-50">OrderPilot</span>
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-zinc-50 mb-1.5">Request early access</h1>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We onboard every restaurant personally. Tell us a bit about your kitchen and we&apos;ll be in touch within 24 hours.
            </p>
          </div>

          {state && 'error' in state && (
            <div className="mb-5 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Your name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Alex"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Restaurant name <span className="text-red-400">*</span>
                </label>
                <input
                  name="restaurant_name"
                  type="text"
                  placeholder="The Stack Kitchen"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Work email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="alex@thestackkitchen.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-2">
                Delivery platforms you use
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex items-center gap-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-2.5 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      name="platforms"
                      value={id}
                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                    />
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-2">
                Orders per day (approx.)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ORDER_RANGES.map(range => (
                  <label
                    key={range}
                    className="flex items-center justify-center bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg px-2 py-2.5 cursor-pointer transition-colors has-[:checked]:border-indigo-500/60 has-[:checked]:bg-indigo-500/10"
                  >
                    <input
                      type="radio"
                      name="orders_per_day"
                      value={range}
                      className="sr-only"
                    />
                    <span className="text-xs font-medium text-zinc-400">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className={cn(
                'w-full flex items-center justify-center gap-2 font-semibold text-sm px-4 py-3 rounded-xl transition-colors mt-2',
                pending
                  ? 'bg-indigo-500/50 text-white/50 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              )}
            >
              {pending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              ) : (
                <>Request access <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-400 hover:text-zinc-200 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
