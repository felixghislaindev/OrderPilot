-- Driver GPS tracking columns on orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS driver_lat                 numeric(10, 7),
  ADD COLUMN IF NOT EXISTS driver_lng                 numeric(10, 7),
  ADD COLUMN IF NOT EXISTS driver_location_updated_at timestamptz;
