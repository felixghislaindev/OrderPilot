'use client'

import { useEffect, useState } from 'react'
import { Key, Copy, Check, Trash2, Loader2, Plus, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  revoked_at: string | null
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors shrink-0"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function ApiKeyPanel() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)

  const fetchKeys = async () => {
    const res = await fetch('/api/billing/api-keys')
    if (res.ok) {
      const { keys } = await res.json()
      setKeys(keys)
    }
    setLoading(false)
  }

  useEffect(() => { fetchKeys() }, [])

  const generate = async () => {
    setGenerating(true)
    const res = await fetch('/api/billing/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Default' }),
    })
    if (res.ok) {
      const data = await res.json()
      setNewKey(data.key)
      await fetchKeys()
    }
    setGenerating(false)
  }

  const revoke = async (id: string) => {
    setRevoking(id)
    await fetch('/api/billing/api-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyId: id }),
    })
    await fetchKeys()
    setRevoking(null)
  }

  const activeKeys = keys.filter(k => !k.revoked_at)
  const revokedKeys = keys.filter(k => k.revoked_at)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">API Keys</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Use these keys to push orders from your restaurant website into OrderPilot.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors shrink-0',
            generating
              ? 'bg-indigo-500/50 text-white/50 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          )}
        >
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          {generating ? 'Generating…' : 'Generate key'}
        </button>
      </div>

      {/* One-time key reveal */}
      {newKey && (
        <div className="mb-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 font-medium">
              Copy this key now — it will not be shown again.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-indigo-300 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 truncate">
              {newKey}
            </code>
            <CopyButton value={newKey} />
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Add this as a Bearer token in your API requests:{' '}
            <code className="text-zinc-500">Authorization: Bearer {'<key>'}</code>
          </p>
          <button
            onClick={() => setNewKey(null)}
            className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            I&apos;ve saved it — dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Loading keys…
        </div>
      ) : activeKeys.length === 0 && !newKey ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <Key className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">No active API keys.</p>
          <p className="text-xs text-zinc-600 mt-0.5">Generate one to start accepting direct orders.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeKeys.map(k => (
            <div
              key={k.id}
              className="flex items-center justify-between gap-3 px-3.5 py-3 bg-zinc-800/50 border border-zinc-800 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-mono text-zinc-300 truncate">{k.key_prefix}…</p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Created {formatDate(k.created_at)}
                    {k.last_used_at && ` · Last used ${formatDate(k.last_used_at)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => revoke(k.id)}
                disabled={revoking === k.id}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors shrink-0 disabled:opacity-50"
              >
                {revoking === k.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {revokedKeys.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-600 mb-2">Revoked keys</p>
          <div className="space-y-1.5">
            {revokedKeys.map(k => (
              <div
                key={k.id}
                className="flex items-center gap-3 px-3.5 py-2.5 bg-zinc-800/20 border border-zinc-800/50 rounded-lg opacity-50"
              >
                <Key className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <p className="text-xs font-mono text-zinc-500 truncate">{k.key_prefix}… · Revoked</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
