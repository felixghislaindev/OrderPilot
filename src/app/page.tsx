import Link from 'next/link'
import {
  Zap,
  ArrowRight,
  LayoutDashboard,
  ChefHat,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
} from 'lucide-react'

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Live Order Feed',
    description: 'Every order from Uber Eats, Deliveroo, Just Eat, and your direct channel in one real-time view. No more tab-switching.',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Board',
    description: 'Kanban-style board built for the pass. Your team sees exactly what\'s incoming, what\'s cooking, and what\'s ready — at a glance.',
  },
  {
    icon: TrendingUp,
    title: 'Delivery Tracker',
    description: 'Know where every order is. Driver assigned, ETA, in transit — all visible without calling anyone.',
  },
  {
    icon: Clock,
    title: 'Performance Analytics',
    description: 'Avg prep time, on-time rate, revenue by platform. Know what\'s working and fix what isn\'t before service ends.',
  },
]

const PLATFORMS = ['Uber Eats', 'Deliveroo', 'Just Eat', 'Direct Orders']

const STATS = [
  { value: '4', label: 'Platforms unified' },
  { value: '<2min', label: 'Avg onboarding' },
  { value: '100%', label: 'Dark kitchen ready' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-zinc-50 tracking-tight">OrderPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/waitlist"
              className="text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Request access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
          </span>
          <span className="text-xs font-medium text-indigo-400">Now in early access</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-zinc-50 tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          Stop juggling tabs.
          <br />
          <span className="text-indigo-400">Run your kitchen.</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          OrderPilot brings every delivery platform into one live dashboard.
          Your team sees what matters. Orders move faster. Nothing gets missed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/waitlist"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Request early access <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Sign in to dashboard
          </Link>
        </div>

        {/* Platform badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          <span className="text-xs text-zinc-600 mr-1">Works with</span>
          {PLATFORMS.map(p => (
            <span
              key={p}
              className="text-xs font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600">orderpilot.app/dashboard</span>
          </div>
          <div className="grid grid-cols-4 divide-x divide-zinc-800 p-0">
            {[
              { label: 'Active Orders', value: '7', color: 'text-zinc-50' },
              { label: 'Revenue Today', value: '£847', color: 'text-emerald-400' },
              { label: 'Avg Prep Time', value: '13 min', color: 'text-zinc-50' },
              { label: 'On-Time Rate', value: '94%', color: 'text-zinc-50' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-px bg-zinc-800 border-t border-zinc-800">
            {[
              { status: 'Incoming', count: 2, color: 'text-blue-400', orders: ['#1251 · Deliveroo · James T.', '#1250 · Uber Eats · Sarah M.'] },
              { status: 'Preparing', count: 3, color: 'text-amber-400', orders: ['#1249 · Just Eat · Ahmed K. ⚡', '#1248 · Direct · Zara H.', '#1247 · Deliveroo · Tom R.'] },
              { status: 'Ready', count: 1, color: 'text-green-400', orders: ['#1246 · Uber Eats · Emma L.'] },
            ].map(col => (
              <div key={col.status} className="bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>{col.status}</span>
                  <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{col.count}</span>
                </div>
                <div className="space-y-2">
                  {col.orders.map(o => (
                    <div key={o} className="text-xs text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2.5">
                      {o}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 divide-x divide-zinc-800">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center px-6">
              <p className="text-3xl font-bold text-zinc-50 mb-1">{value}</p>
              <p className="text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-zinc-50 mb-3">Everything your kitchen needs</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Built by operators, for operators. Every feature exists because a real kitchen needed it.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-400" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-50 mb-3">Up and running in minutes</h2>
            <p className="text-zinc-500">No integrations team. No week-long setup. Just your kitchen, organised.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Request access', body: 'We onboard you personally. Tell us your platforms and we set up your restaurant profile.' },
              { step: '02', title: 'See your orders live', body: 'Log in and your dashboard is live. Every platform, one screen, real-time.' },
              { step: '03', title: 'Run a faster kitchen', body: 'Your team accepts, prepares, and tracks orders without chaos. You get the data to improve.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative">
                <span className="text-5xl font-black text-zinc-800 leading-none">{step}</span>
                <h3 className="text-sm font-semibold text-zinc-100 mt-2 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-50 mb-4">
              Ready to bring order to your kitchen?
            </h2>
            <p className="text-zinc-500 mb-8">
              Early access is limited. We work with each restaurant hands-on to make sure OrderPilot fits your operation.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Get early access <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-4 mt-6">
              {['No setup fees', 'Cancel anytime', 'Personal onboarding'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-zinc-500">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-400">OrderPilot</span>
          </div>
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} OrderPilot. Built for restaurants that move fast.</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-xs text-zinc-600 ml-1.5">Early access</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
