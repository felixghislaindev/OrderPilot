'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { approveWaitlistEntry } from './actions'

export function ApproveButton({
  id,
  email,
  restaurantName,
}: {
  id: string
  email: string
  restaurantName: string
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleApprove = async () => {
    setState('loading')
    const result = await approveWaitlistEntry(id, email, restaurantName)
    if (result && 'error' in result) {
      setErrorMsg(result.error ?? 'Something went wrong.')
      setState('error')
    } else {
      setState('done')
    }
  }

  if (state === 'done') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
        <CheckCircle2 className="w-4 h-4" />
        Invited
      </div>
    )
  }

  if (state === 'error') {
    return <span className="text-xs text-red-400">{errorMsg}</span>
  }

  return (
    <button
      onClick={handleApprove}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white transition-colors shrink-0"
    >
      {state === 'loading' ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
      ) : (
        'Approve & Invite'
      )}
    </button>
  )
}
