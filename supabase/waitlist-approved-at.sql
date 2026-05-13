-- Run in Supabase SQL Editor
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS approved_at timestamptz;
