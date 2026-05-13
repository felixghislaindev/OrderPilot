-- OrderPilot seed data — "The Stack Kitchen"
-- Run AFTER schema.sql
-- Replace YOUR_USER_ID with your ID from: Authentication → Users → click your user → copy UUID

DO $$
DECLARE
  v_user_id   uuid := '4e4d467c-535f-43c5-858b-8c7e38534b1f';
  v_rest_id   uuid;
  v_ord_id    uuid;
  v_now       timestamptz := now();
BEGIN

-- Restaurant
INSERT INTO restaurants (owner_id, name, timezone, platforms)
VALUES (v_user_id, 'The Stack Kitchen', 'Europe/London',
        ARRAY['uber_eats','deliveroo','just_eat','direct']::platform_type[])
RETURNING id INTO v_rest_id;

-- ── Order 1 — Deliveroo · pending ────────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, estimated_prep_minutes)
VALUES (v_rest_id, '1247', 'deliveroo', 'pending', 'James T.',
  3670, 199, 3869, v_now - interval '1 min', 15)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Double Smash Burger', 2, 1290),
  (v_ord_id, 'Loaded Fries',        1,  590),
  (v_ord_id, 'Diet Coke',           2,  250);

-- ── Order 2 — Uber Eats · preparing ──────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at, estimated_prep_minutes)
VALUES (v_rest_id, '1246', 'uber_eats', 'preparing', 'Sarah M.',
  2230, 249, 2479,
  v_now - interval '8 min', v_now - interval '7 min', v_now - interval '6 min', 12)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Crispy Chicken Burger', 1, 1150),
  (v_ord_id, 'Onion Rings',           1,  490),
  (v_ord_id, 'Strawberry Shake',      1,  590);

-- ── Order 3 — Just Eat · preparing · URGENT ──────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at,
  estimated_prep_minutes, notes, is_urgent)
VALUES (v_rest_id, '1245', 'just_eat', 'preparing', 'Ahmed K.',
  5690, 199, 5889,
  v_now - interval '12 min', v_now - interval '11 min', v_now - interval '10 min',
  18, 'No pickles on all burgers please', true)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'BBQ Bacon Stack',      3, 1350),
  (v_ord_id, 'Sweet Potato Fries',   2,  620),
  (v_ord_id, 'Mineral Water',        3,  200);

-- ── Order 4 — Deliveroo · ready ──────────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at, ready_at,
  estimated_prep_minutes, driver_name, driver_eta_minutes, driver_rating)
VALUES (v_rest_id, '1244', 'deliveroo', 'ready', 'Emma L.',
  3760, 199, 3959,
  v_now - interval '22 min', v_now - interval '21 min', v_now - interval '19 min', v_now - interval '4 min',
  15, 'Marcus D.', 3, 4.9)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Veggie Smash',  2, 1190),
  (v_ord_id, 'Truffle Fries', 2,  690);

-- ── Order 5 — Uber Eats · picked_up ──────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at, ready_at, picked_up_at,
  estimated_prep_minutes, driver_name, driver_eta_minutes, driver_rating)
VALUES (v_rest_id, '1243', 'uber_eats', 'picked_up', 'Chen W.',
  4840, 249, 5089,
  v_now - interval '35 min', v_now - interval '34 min', v_now - interval '32 min',
  v_now - interval '18 min', v_now - interval '12 min',
  14, 'Priya S.', 8, 4.7)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Classic Smash',  2, 1090),
  (v_ord_id, 'Cheese Dog',     1,  890),
  (v_ord_id, 'Loaded Fries',   2,  590),
  (v_ord_id, 'Vanilla Shake',  1,  590);

-- ── Order 6 — Direct · confirmed ─────────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at,
  estimated_prep_minutes, notes)
VALUES (v_rest_id, '1242', 'direct', 'confirmed', 'Oliver B.',
  3780, 0, 3780,
  v_now - interval '4 min', v_now - interval '3 min',
  20, 'Please ring doorbell twice')
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Family Bundle',    1, 3490),
  (v_ord_id, 'Extra Sauce Set',  1,  290);

-- ── Order 7 — Just Eat · preparing ───────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at, estimated_prep_minutes)
VALUES (v_rest_id, '1241', 'just_eat', 'preparing', 'Zara H.',
  3170, 199, 3369,
  v_now - interval '14 min', v_now - interval '13 min', v_now - interval '11 min', 13)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Spicy Jalapeño Burger', 2, 1290),
  (v_ord_id, 'Loaded Fries',          1,  590);

-- ── Order 8 — Deliveroo · delivered ──────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total,
  placed_at, confirmed_at, prep_started_at, ready_at, picked_up_at, delivered_at,
  estimated_prep_minutes, driver_name, driver_rating)
VALUES (v_rest_id, '1240', 'deliveroo', 'delivered', 'Tom R.',
  1930, 199, 2129,
  v_now - interval '58 min', v_now - interval '57 min', v_now - interval '55 min',
  v_now - interval '42 min', v_now - interval '38 min', v_now - interval '25 min',
  13, 'David K.', 4.8)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Double Smash Burger', 1, 1290),
  (v_ord_id, 'Classic Fries',       1,  390),
  (v_ord_id, 'Coke',                1,  250);

-- ── Order 9 — Uber Eats · pending ────────────────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, estimated_prep_minutes)
VALUES (v_rest_id, '1239', 'uber_eats', 'pending', 'Fatima A.',
  2460, 249, 2709, v_now, 12)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Crispy Chicken Burger', 1, 1150),
  (v_ord_id, 'Sweet Potato Fries',    1,  620),
  (v_ord_id, 'Oreo Shake',            1,  690);

-- ── Order 10 — Direct · preparing · URGENT ───────────────────────────────────
INSERT INTO orders (restaurant_id, display_id, platform, status, customer_name,
  subtotal, delivery_fee, total, placed_at, confirmed_at, prep_started_at,
  estimated_prep_minutes, notes, is_urgent)
VALUES (v_rest_id, '1238', 'direct', 'preparing', 'Harry P.',
  8520, 0, 8520,
  v_now - interval '16 min', v_now - interval '15 min', v_now - interval '13 min',
  20, 'Large office order — label bags separately', true)
RETURNING id INTO v_ord_id;
INSERT INTO order_items (order_id, name, quantity, price) VALUES
  (v_ord_id, 'Double Smash Burger', 4, 1290),
  (v_ord_id, 'Loaded Fries',        4,  590),
  (v_ord_id, 'Soft Drinks',         4,  250);

END $$;
