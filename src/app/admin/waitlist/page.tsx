import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ApproveButton } from './ApproveButton'
import { ResendButton } from './ResendButton'
import { Zap, Users, CheckCircle2, Clock, MailCheck } from 'lucide-react'


type WaitlistEntry = {
  id: string
  name: string
  restaurant_name: string
  email: string
  platforms: string[]
  orders_per_day: string | null
  created_at: string
  approved_at: string | null
  invite_resent_at: string | null
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

  const all = (entries ?? []) as WaitlistEntry[]
  const pending = all.filter(e => !e.approved_at)
  const invited = all.filter(e => e.approved_at)

  // Check which invited users have actually confirmed their account
  const confirmedEmails = new Set<string>()
  if (invited.length > 0) {
    const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
    for (const u of authUsers ?? []) {
      if (u.email && u.last_sign_in_at) confirmedEmails.add(u.email)
    }
  }

  const confirmed = invited.filter(e => confirmedEmails.has(e.email))
  const awaitingResponse = invited.filter(e => !confirmedEmails.has(e.email))

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
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total submissions', value: all.length, icon: Users },
            { label: 'Pending approval', value: pending.length, icon: Clock },
            { label: 'Invited', value: invited.length, icon: MailCheck },
            { label: 'Confirmed', value: confirmed.length, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <Icon className="w-4 h-4 text-zinc-600 mb-2" />
              <p className="text-2xl font-bold text-zinc-50">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending */}
        <Section title={`Pending (${pending.length})`}>
          {pending.length === 0 ? (
            <Empty label="No pending submissions" />
          ) : (
            pending.map(entry => (
              <EntryCard key={entry.id} entry={entry}>
                <ApproveButton id={entry.id} email={entry.email} restaurantName={entry.restaurant_name} />
              </EntryCard>
            ))
          )}
        </Section>

        {/* Awaiting response */}
        {awaitingResponse.length > 0 && (
          <Section title={`Awaiting response (${awaitingResponse.length})`}>
            {awaitingResponse.map(entry => (
              <EntryCard key={entry.id} entry={entry} badge="Invited">
                <ResendButton id={entry.id} email={entry.email} restaurantName={entry.restaurant_name} />
              </EntryCard>
            ))}
          </Section>
        )}

        {/* Confirmed */}
        {confirmed.length > 0 && (
          <Section title={`Confirmed (${confirmed.length})`}>
            {confirmed.map(entry => (
              <EntryCard key={entry.id} entry={entry} badge="Active" />
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Empty({ label }: { label: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
      <p className="text-sm text-zinc-600">{label}</p>
    </div>
  )
}

function EntryCard({
  entry,
  badge,
  children,
}: {
  entry: WaitlistEntry
  badge?: 'Invited' | 'Active'
  children?: React.ReactNode
}) {
  const submitted = new Date(entry.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const invitedAt = entry.invite_resent_at ?? entry.approved_at
  const invitedLabel = invitedAt
    ? `Invited ${new Date(invitedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : null

  const badgeColors = {
    Invited: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-zinc-100">{entry.restaurant_name}</p>
            {badge && (
              <span className={`text-xs border px-2 py-0.5 rounded-full ${badgeColors[badge]}`}>
                {badge}
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
            <span className="text-xs text-zinc-700">{submitted}</span>
            {invitedLabel && (
              <span className="text-xs text-zinc-600">· {invitedLabel}</span>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
