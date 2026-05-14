import { createHash, randomBytes } from 'crypto'

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = randomBytes(32).toString('base64url')
  const key = `op_live_${raw}`
  const hash = createHash('sha256').update(key).digest('hex')
  const prefix = key.slice(0, 16) // "op_live_" + first 8 chars
  return { key, hash, prefix }
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}
