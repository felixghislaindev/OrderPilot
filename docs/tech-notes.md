# OrderPilot Tech Notes

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | App Router gives RSC + server actions; no separate API layer needed |
| Language | TypeScript | Catch type errors early; domain types are the spec |
| Styling | Tailwind CSS v4 | Fast iteration; no design system overhead |
| Components | shadcn/ui + Lucide icons | Copy-paste components, no black-box lib lock-in |
| Auth + DB | Supabase | Instant Postgres + auth + realtime; no backend to operate |
| Deployment | Vercel | Zero-config Next.js deploys; git push = live |

---

## Architecture

Single Next.js app. No separate backend. No microservices.

```
src/
  app/
    (auth)/login/          # Unauthenticated pages
    (dashboard)/           # Authenticated shell (Sidebar + TopBar layout)
      dashboard/           # Main ops view
      orders/              # Order list with filters
      kitchen/             # Kanban board
      analytics/           # Performance metrics
      settings/            # Restaurant config
  components/
    dashboard/             # AnalyticsStrip, LiveOrderFeed, KitchenBoard, DeliveryTracker
    layout/                # Sidebar, TopBar
    orders/                # OrderCard
  lib/
    mock-data.ts           # Demo orders + analytics (replace with Supabase)
    supabase/client.ts     # Browser Supabase client
    supabase/server.ts     # Server Supabase client (SSR)
    utils.ts               # cn(), formatCurrency(), status/platform helpers
  middleware.ts            # Auth guard (passthrough in demo mode)
  types/orders.ts          # All domain types
```

---

## Domain Types

`src/types/orders.ts` is the single source of truth. Key types:

- `Order` — full order with items, timestamps, driver, status
- `OrderStatus` — `pending | confirmed | preparing | ready | picked_up | delivered | cancelled`
- `Platform` — `uber_eats | deliveroo | just_eat | direct`
- `DailyAnalytics` — aggregated daily stats with platform breakdown
- `RestaurantProfile` — restaurant metadata and active platforms

Currency is stored in **pence** (integer). `formatCurrency()` converts to GBP display.

---

## Key Implementation Details

**Status transitions** are driven by the `NEXT_STATUS` map in `OrderCard.tsx`. The UI enforces a linear flow; cancelled is only set externally (platform webhook, future).

**Overdue detection:** `minutesSince(placed_at) > estimated_prep_minutes` — fires for all non-terminal statuses. Shows red border + "Overdue" label.

**Urgency:** `is_urgent: true` on an order adds amber border + AlertTriangle icon. Set by operator or auto-triggered (future: rule-based).

**Dark-first design:** No `dark:` Tailwind variants anywhere. All colors are already dark. Adding `dark:` variants will break the design.

**Server vs. client components:** `"use client"` required for any component using state, effects, or event handlers. Layout wrappers and static pages are server components.

---

## Deployment

- Platform: Vercel
- URL: https://orderpilot-zeta.vercel.app
- Trigger: `git push` to `main` → auto-deploy
- Build: `next build` (Turbopack in dev, standard in prod)
- No env vars needed for demo mode (mock data, no Supabase)

**To activate Supabase:**
1. Copy `.env.example` → `.env.local`
2. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Add same vars to Vercel project settings
4. Replace middleware passthrough with Supabase session check

---

## Security

- CVE-2025-66478 patched by upgrading to Next.js 15.3.9 (2026-05-12)
- `.mcp.json` excluded from git (contains Vercel MCP secrets)
- Supabase RLS must be enabled on all tables before going live — multi-restaurant isolation depends on it

---

## Future Technical Considerations

- **Realtime:** Supabase `channel().on('postgres_changes')` is the path for live order updates. No additional infra needed.
- **Platform webhooks:** Uber Eats, Deliveroo, Just Eat all offer webhook order push. Route Handlers (`app/api/webhooks/[platform]/route.ts`) will receive and normalize these.
- **AI features:** Prep time prediction can be a simple regression on `order_items` + `estimated_prep_minutes` history before reaching for an LLM.
- **State management:** `useState` on mock data is fine now. Wire Supabase realtime subscriptions directly; only reach for Zustand/React Query if subscription state gets complex.
