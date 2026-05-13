import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ApproveButton } from './ApproveButton'
import { Zap, Users, CheckCircle2, Clock } from 'lucide-react'


type WaitlistEntry = {
  id: string
  name: string
  restaurant_name: string
  email: string
  platforms: string[]
  orders_per_day: string | null
  created_at: string
  approved_at: string | null
}

export default async function AdminWaitlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: entries } = await admin
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  const pending = (entries ?? []).filter((e: WaitlistEntry) => !e.approved_at)
  const approved = (entries ?? []).filter((e: WaitlistEntry) => e.approved_at)

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-base font-semibold text-zinc-50">OrderPilot</span>
            <span className="text-xs text-zinc-500 ml-2">Admin — Waitlist</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total submissions', value: entries?.length ?? 0, icon: Users },
            { label: 'Pending approval', value: pending.length, icon: Clock },
            { label: 'Approved', value: approved.length, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <Icon className="w-4 h-4 text-zinc-600 mb-2" />
              <p className="text-2xl font-bold text-zinc-50">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Pending ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-sm text-zinc-600">No pending submissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((entry: WaitlistEntry) => (
                <EntryCard key={entry.id} entry={entry} showApprove />
              ))}
            </div>
          )}
        </div>

        {/* Approved */}
        {approved.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Approved ({approved.length})
            </h2>
            <div className="space-y-3">
              {approved.map((entry: WaitlistEntry) => (
                <EntryCard key={entry.id} entry={entry} showApprove={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EntryCard({ entry, showApprove }: { entry: WaitlistEntry; showApprove: boolean }) {
  const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-zinc-100">{entry.restaurant_name}</p>
            {entry.approved_at && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Approved
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">{entry.name} · {entry.email}</p>
          <div className="flex items-center gap-3 mt-2">
            {entry.platforms.length > 0 && (
              <span className="text-xs text-zinc-500">
                {entry.platforms.join(', ').replace(/_/g, ' ')}
              </span>
            )}
            {entry.orders_per_day && (
              <span className="text-xs text-zinc-600">{entry.orders_per_day} orders/day</span>
            )}
            <span className="text-xs text-zinc-700">{date}</span>
          </div>
        </div>
        {showApprove && (
          <ApproveButton
            id={entry.id}
            email={entry.email}
            restaurantName={entry.restaurant_name}
          />
        )}
      </div>
    </div>
  )
}
