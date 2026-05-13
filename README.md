# ⚡ OrderPilot

> Real-time order management for delivery restaurants.

OrderPilot gives restaurant kitchens one live dashboard for every order — Uber Eats, Deliveroo, Just Eat, and direct channels — with no refresh needed.

🌐 **[orderpilot.online](https://orderpilot.online)**

---

## What it does

- **Live order feed** — every new order appears instantly, colour-coded by platform
- **Kitchen board** — kanban view: Incoming → Preparing → Ready
- **Delivery tracker** — sidebar panel for picked-up and ready orders
- **Analytics** — revenue, avg prep time, on-time rate, updated live
- **Waitlist → invite flow** — restaurants request access, get a branded invite email, set their password, and land on a working dashboard

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (Postgres + RLS + Realtime) |
| Email | Resend + React Email |
| Hosting | Vercel |
| Domain | orderpilot.online (IONOS) |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/felixghislaindev/OrderPilot.git
cd OrderPilot
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
INVITE_DELAY_MINUTES=0
```

### 3. Set up the database

Run these SQL files in your Supabase SQL editor (in order):

```
supabase/schema.sql
supabase/waitlist.sql
supabase/waitlist-approved-at.sql
supabase/waitlist-resend-tracking.sql
supabase/restaurants-onboarded.sql
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── (auth)/login/          # Sign in page
│   ├── (dashboard)/           # Authenticated app shell
│   │   ├── dashboard/         # Live order feed
│   │   ├── kitchen/           # Kitchen board
│   │   ├── analytics/         # Analytics
│   │   └── settings/          # Restaurant settings
│   ├── admin/waitlist/        # Admin — manage waitlist entries
│   ├── auth/
│   │   ├── confirm/           # Invite token exchange
│   │   ├── set-password/      # First-time password setup
│   │   ├── forgot-password/   # Request reset email
│   │   └── reset-password/    # Reset password
│   ├── onboarding/            # 4-step product tour (first login)
│   └── waitlist/              # Public waitlist form
├── components/
│   └── dashboard/             # OrderFeed, KitchenBoard, AnalyticsStrip, etc.
├── contexts/
│   └── OrdersContext.tsx      # Realtime orders + status transitions
├── emails/
│   ├── InviteEmail.tsx        # Branded invite email
│   └── ResetEmail.tsx         # Branded password reset email
└── lib/
    └── supabase/              # Server, client, and admin Supabase clients
```

---

## Key flows

**Waitlist → onboarding:**
1. Restaurant submits `/waitlist` form
2. Supabase user created + branded invite email sent via Resend (`hello@orderpilot.online`)
3. User clicks link → `/auth/confirm` exchanges token → `/auth/set-password`
4. Password set → `/onboarding` 4-step product tour
5. Tour complete → `/dashboard`

**Forgot password:**
1. User visits `/auth/forgot-password`
2. Branded reset email sent via Resend
3. User clicks link → `/auth/reset-password` exchanges token + shows form
4. Password updated → `/dashboard`

---

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check without emit
```

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `NEXT_PUBLIC_SITE_URL` | Base URL (`https://orderpilot.online` in production) |
| `INVITE_DELAY_MINUTES` | `0` = send invite immediately on waitlist signup |

---

Built for restaurants that move fast.
