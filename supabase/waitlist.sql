-- Waitlist table — run in Supabase SQL Editor

CREATE TABLE waitlist (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text        NOT NULL,
  restaurant_name text        NOT NULL,
  email           text        NOT NULL UNIQUE,
  platforms       text[]      NOT NULL DEFAULT '{}',
  orders_per_day  text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "public can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (you) can read submissions
CREATE POLICY "authenticated can read waitlist" ON waitlist
  FOR SELECT USING (auth.role() = 'authenticated');
