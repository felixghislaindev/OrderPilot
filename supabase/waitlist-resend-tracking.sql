-- Track when invite was most recently resent
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS invite_resent_at timestamptz;
