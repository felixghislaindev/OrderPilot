-- OrderPilot schema
-- Run this in: Supabase Dashboard → SQL Editor → New query

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE platform_type AS ENUM ('uber_eats', 'deliveroo', 'just_eat', 'direct');
CREATE TYPE order_status   AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled');

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE restaurants (
  id         uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text          NOT NULL,
  timezone   text          NOT NULL DEFAULT 'Europe/London',
  platforms  platform_type[] NOT NULL DEFAULT '{}',
  logo_url   text,
  created_at timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id                     uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id          uuid          NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  display_id             text          NOT NULL,
  platform               platform_type NOT NULL,
  status                 order_status  NOT NULL DEFAULT 'pending',
  customer_name          text          NOT NULL,
  customer_phone         text,
  subtotal               integer       NOT NULL, -- stored in pence
  delivery_fee           integer       NOT NULL DEFAULT 0,
  total                  integer       NOT NULL,
  placed_at              timestamptz   NOT NULL DEFAULT now(),
  confirmed_at           timestamptz,
  prep_started_at        timestamptz,
  ready_at               timestamptz,
  picked_up_at           timestamptz,
  delivered_at           timestamptz,
  estimated_prep_minutes integer       NOT NULL DEFAULT 15,
  delivery_address       text,
  notes                  text,
  is_urgent              boolean       NOT NULL DEFAULT false,
  driver_name            text,
  driver_phone           text,
  driver_eta_minutes     integer,
  driver_rating          numeric(3,1),
  created_at             timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name     text    NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price    integer NOT NULL, -- pence
  notes    text
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner manages restaurant" ON restaurants
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "owner manages orders" ON orders
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid())
  );

CREATE POLICY "owner manages order_items" ON order_items
  FOR ALL USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE r.owner_id = auth.uid()
    )
  );

-- ─── Realtime ─────────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
