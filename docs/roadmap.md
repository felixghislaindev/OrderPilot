# OrderPilot Roadmap

## Product
AI-powered delivery operations dashboard for restaurants. Helps kitchens manage live orders, reduce chaos, and track performance across Uber Eats, Deliveroo, Just Eat, and direct orders.

---

## Phase 1 — Frontend MVP ✅ COMPLETE
**Goal:** Deployed, visually credible dashboard that demonstrates the product vision.

- [x] Next.js 15 App Router project scaffolded
- [x] Dark-first design system (Tailwind v4)
- [x] Sidebar + TopBar authenticated layout shell
- [x] Dashboard: AnalyticsStrip, LiveOrderFeed, KitchenBoard, DeliveryTracker
- [x] Orders page with filterable grid
- [x] Kitchen kanban board (Incoming → Preparing → Ready)
- [x] Analytics page with platform breakdown
- [x] OrderCard with status transitions, urgency, overdue detection
- [x] 10 realistic mock orders for "The Stack Kitchen"
- [x] Login page UI (passthrough, demo mode)
- [x] Deployed to Vercel: https://orderpilot-zeta.vercel.app
- [x] CVE-2025-66478 patched (Next.js 15.3.9)

---

## Phase 2 — Real Backend ← CURRENT
**Goal:** Real auth, real data, deploy to a live restaurant for beta testing.

- [ ] Supabase project provisioned
- [ ] Auth activated (email/password via Supabase + middleware guard)
- [ ] Database schema: `restaurants`, `orders`, `order_items`, `drivers`
- [ ] Replace mock data with Supabase queries
- [ ] Realtime order subscriptions (orders page, kitchen board)
- [ ] Persist status transitions to DB
- [ ] Multi-restaurant isolation (RLS policies)
- [ ] Env vars wired on Vercel

**Done when:** A restaurant owner logs in, sees their actual orders update live.

---

## Phase 3 — First Paying Customer
**Goal:** Enough polish and reliability to charge a real restaurant.

- [ ] Onboarding flow (restaurant setup, platform selection)
- [ ] Settings: restaurant profile, prep time defaults, notifications
- [ ] Historical analytics (7-day, 30-day views)
- [ ] Mobile-responsive kitchen view (phone/tablet at pass)
- [ ] Basic email alerts (overdue orders, no driver assigned)
- [ ] Stripe billing integration

**Done when:** First MRR.

---

## Phase 4 — Growth Features
**Not yet scoped — revisit after Phase 3.**

- AI prep time predictions based on order history
- Platform API integrations (auto-ingest orders without manual entry)
- Driver tracking / ETA improvements
- Multi-location support
- Slack / WhatsApp notifications

---

## Guiding principle
Ship Phase 2 before designing Phase 3. Ship Phase 3 before scoping Phase 4.
