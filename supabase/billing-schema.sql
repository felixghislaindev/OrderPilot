-- OrderPilot billing schema
-- Run in: Supabase Dashboard → SQL Editor → New query

-- ─── Restaurants: billing columns ────────────────────────────────────────────

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS stripe_customer_id      text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  text,
  ADD COLUMN IF NOT EXISTS subscription_status     text NOT NULL DEFAULT 'trialing'
    CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'cancelled', 'incomplete'));

-- ─── API keys (order intake authentication) ───────────────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid        NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  key_hash      text        NOT NULL UNIQUE,   -- SHA-256 of full key, never store plaintext
  key_prefix    text        NOT NULL,           -- first 16 chars for display ("op_live_xxxxxxxx")
  name          text        NOT NULL DEFAULT 'Default',
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "owner manages api_keys" ON api_keys
    FOR ALL USING (
      restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Stripe event idempotency ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stripe_events (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     text        NOT NULL UNIQUE,
  type         text        NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- stripe_events is service-role only — no RLS needed

-- ─── Orders: external ref for intake deduplication ───────────────────────────

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS external_ref text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_restaurant_external_ref
  ON orders (restaurant_id, external_ref)
  WHERE external_ref IS NOT NULL;
