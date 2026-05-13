'use client'

import { useState } from 'react'
import { Zap, Radio, LayoutGrid, BarChart2, ArrowRight, X } from 'lucide-react'
import { completeOnboarding } from './actions'

const STEPS = [
  {
    icon: Zap,
    label: 'Welcome',
    title: 'Your kitchen dashboard is live.',
    description: "OrderPilot gives your kitchen one place to see every order, across every channel, in real time. Here's a quick look at how it works.",
    visual: <WelcomeVisual />,
  },
  {
    icon: Radio,
    label: 'Live orders',
    title: 'Orders appear the moment they come in.',
    description: 'No refresh needed. Every new order lands on your feed instantly — colour-coded by platform, flagged when urgent, and timed from the second it was placed.',
    visual: <OrderFeedVisual />,
  },
  {
    icon: LayoutGrid,
    label: 'Kitchen board',
    title: 'Move orders through your kitchen.',
    description: 'Incoming → Preparing → Ready. Tap to advance an order. Your whole team sees the same board, live.',
    visual: <KitchenBoardVisual />,
  },
  {
    icon: BarChart2,
    label: 'Analytics',
    title: 'Know how your kitchen is performing.',
    description: "Revenue, average prep time, on-time rate — updated live as orders move through. You'll always know if you're on track.",
    visual: <AnalyticsVisual />,
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const { icon: Icon, title, description, visual, label } = STEPS[step]

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-50">OrderPilot</span>
          </div>
          <form action={completeOnboarding}>
            <button type="submit" className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              <X className="w-3.5 h-3.5" /> Skip tour
            </button>
          </form>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-indigo-500' : i < step ? 'w-4 bg-indigo-500/40' : 'w-4 bg-zinc-800'
              }`}
            />
          ))}
          <span className="text-xs text-zinc-600 ml-2">{step + 1} of {STEPS.length}</span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

          {/* Visual */}
          <div className="bg-zinc-950 border-b border-zinc-800 p-6 h-48 flex items-center justify-center">
            {visual}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{label}</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-50 mb-2">{title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">{description}</p>

            <div className="flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  ← Back
                </button>
              ) : <div />}

              {isLast ? (
                <form action={completeOnboarding}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Go to dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Visuals ──────────────────────────────────────────────────────────────────

function WelcomeVisual() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-zinc-50">OrderPilot</p>
        <p className="text-xs text-zinc-500">Your kitchen, in real time</p>
      </div>
    </div>
  )
}

function OrderFeedVisual() {
  const orders = [
    { platform: 'Uber Eats', label: 'UE', color: 'bg-zinc-700 text-zinc-300', item: '2× Burger, 1× Fries', time: '2m', urgent: false },
    { platform: 'Deliveroo', label: 'DR', color: 'bg-teal-500/20 text-teal-400', item: '1× Pizza Margherita', time: '8m', urgent: true },
    { platform: 'Direct', label: 'DI', color: 'bg-blue-500/20 text-blue-400', item: '3× Wings, 2× Sides', time: '12m', urgent: false },
  ]
  return (
    <div className="w-full space-y-2">
      {orders.map((o, i) => (
        <div key={i} className={`flex items-center gap-3 bg-zinc-900 rounded-lg px-3 py-2 border ${o.urgent ? 'border-amber-500/30' : 'border-zinc-800'}`}>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${o.color}`}>{o.label}</span>
          <span className="text-xs text-zinc-300 flex-1 truncate">{o.item}</span>
          <span className="text-xs text-zinc-600">{o.time} ago</span>
        </div>
      ))}
    </div>
  )
}

function KitchenBoardVisual() {
  const columns = [
    { label: 'Incoming', count: 2, color: 'text-zinc-400' },
    { label: 'Preparing', count: 3, color: 'text-amber-400' },
    { label: 'Ready', count: 1, color: 'text-emerald-400' },
  ]
  return (
    <div className="flex gap-3 w-full">
      {columns.map(col => (
        <div key={col.label} className="flex-1 bg-zinc-900 rounded-lg p-2.5 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
            <span className="text-xs text-zinc-600">{col.count}</span>
          </div>
          {Array.from({ length: Math.min(col.count, 2) }).map((_, i) => (
            <div key={i} className="h-5 bg-zinc-800 rounded mb-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

function AnalyticsVisual() {
  const stats = [
    { label: 'Revenue today', value: '£284' },
    { label: 'Avg prep time', value: '11m' },
    { label: 'On-time rate', value: '94%' },
  ]
  return (
    <div className="flex gap-3 w-full">
      {stats.map(stat => (
        <div key={stat.label} className="flex-1 bg-zinc-900 rounded-lg p-3 border border-zinc-800 text-center">
          <p className="text-lg font-bold text-zinc-50">{stat.value}</p>
          <p className="text-xs text-zinc-600 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
