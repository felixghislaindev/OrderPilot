# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check without emit
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Vercel

## Architecture

Single Next.js app — no separate backend. Supabase handles auth and data persistence.

**Route groups:**
- `app/(auth)/` — unauthenticated pages (login)
- `app/(dashboard)/` — authenticated app shell using `Sidebar` + `TopBar` layout

**Key source files:**
- `src/types/orders.ts` — all domain types: `Order`, `Platform`, `OrderStatus`, `Driver`, etc.
- `src/lib/mock-data.ts` — realistic mock orders and analytics for demo/development
- `src/lib/utils.ts` — `cn()`, `formatCurrency()`, `getPlatformColors()`, `getStatusColors()`, `minutesSince()`
- `src/lib/supabase/client.ts` / `server.ts` — Supabase browser and server clients (SSR)
- `src/middleware.ts` — auth guard (currently passthrough; replace with Supabase session check)

**Dashboard components** (`src/components/dashboard/`):
- `AnalyticsStrip` — 4 KPI cards (active orders, revenue, avg prep time, on-time rate)
- `LiveOrderFeed` — filterable order grid with status transitions
- `KitchenBoard` — kanban columns: Incoming / Preparing / Ready
- `DeliveryTracker` — sidebar panel for picked-up and ready orders

**Order card behavior:**
- Status transitions driven by `NEXT_STATUS` map in `OrderCard.tsx`
- `is_urgent: true` shows amber border + warning icon
- Overdue detection: `minutesSince(placed_at) > estimated_prep_minutes`

## Design system

Dark-first. Never add `dark:` variants — all colors are already dark.

| Token | Tailwind class |
|-------|---------------|
| Page bg | `bg-zinc-950` |
| Card bg | `bg-zinc-900` |
| Borders | `border-zinc-800` |
| Primary text | `text-zinc-50` / `text-zinc-200` |
| Muted text | `text-zinc-400` / `text-zinc-500` |
| Accent | `text-indigo-400`, `bg-indigo-500` |

Platform colors: Uber Eats (zinc), Deliveroo (teal), Just Eat (orange), Direct (blue) — see `getPlatformColors()` in utils.

Status colors: pending (zinc), confirmed (blue), preparing (amber), ready (green), picked_up (purple), delivered (dim zinc), cancelled (red) — see `getStatusColors()`.

## Connecting Supabase

1. Copy `.env.example` → `.env.local` and fill in project URL and anon key
2. Replace mock data imports with Supabase queries / realtime subscriptions
3. Activate auth in `src/middleware.ts` using `@supabase/ssr`

## Engineering rules

- All interactive components need `"use client"` — server components are only for static layouts and data fetching
- State management is local (`useState`) on top of mock data; introduce Zustand or React Query only when Supabase is wired
- No microservices, no separate API layer — Next.js Route Handlers if a server-side endpoint is needed
- Deploy to Vercel: `git push` is sufficient, no config needed
