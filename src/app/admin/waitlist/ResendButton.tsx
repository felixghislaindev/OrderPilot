'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { resendInvite } from './actions'

export function ResendButton({
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

  const handleResend = async () => {
    setState('loading')
    const result = await resendInvite(id, email, restaurantName)
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
        <CheckCircle2 className="w-3.5 h-3.5" />
        Resent
      </div>
    )
  }

  if (state === 'error') {
    return <span className="text-xs text-red-400">{errorMsg}</span>
  }

  return (
    <button
      onClick={handleResend}
      disabled={state === 'loading'}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 transition-colors shrink-0"
    >
      {state === 'loading' ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
      ) : (
        <><RefreshCw className="w-3.5 h-3.5" /> Resend invite</>
      )}
    </button>
  )
}
