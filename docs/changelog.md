# OrderPilot Changelog

## [0.2.0] — 2026-05-12

### Security
- Upgraded Next.js to 15.3.9 to patch CVE-2025-66478

### Tooling
- Added Vercel MCP server for agentic deployment management
- Excluded `.mcp.json` from git tracking (contains Vercel API secrets)

---

## [0.1.0] — 2026-05-12

### Initial MVP — Frontend Complete, Demo Mode

**Deployment**
- Deployed to Vercel: https://orderpilot-zeta.vercel.app
- `git push` → auto-deploy pipeline working
- Build and type-check both passing clean

**Application Shell**
- Next.js 15 App Router with route groups: `(auth)` and `(dashboard)`
- Sidebar navigation with 5 routes: Dashboard, Orders, Kitchen, Analytics, Settings
- TopBar with restaurant name and live clock
- Dark-first design system using Tailwind v4

**Dashboard**
- `AnalyticsStrip` — 4 KPI cards: active orders, revenue, avg prep time, on-time rate
- `LiveOrderFeed` — filterable order grid, status filter tabs by platform/status
- `KitchenBoard` — kanban with Incoming / Preparing / Ready columns
- `DeliveryTracker` — sidebar panel for picked_up and ready orders

**Order Management**
- `OrderCard` component with full order detail: items, notes, driver, timestamps
- Status transition buttons (Accept → Start Prep → Mark Ready → Picked Up)
- Urgency indicator: amber border + warning icon for `is_urgent` orders
- Overdue detection: red border + label when elapsed > estimated prep time
- Compact mode for KitchenBoard cards

**Data Layer**
- 10 realistic mock orders for demo restaurant "The Stack Kitchen"
- All 4 platforms represented: Uber Eats, Deliveroo, Just Eat, Direct
- All 7 order statuses represented in mock data
- `DailyAnalytics` mock with platform breakdown (47 orders, £1,894 revenue)
- `RestaurantProfile` type established

**Auth**
- Login page UI implemented
- Supabase SSR clients wired (`client.ts` + `server.ts`)
- Middleware in passthrough mode (demo — no session required)

**Types**
- `Order`, `OrderStatus`, `Platform`, `OrderItem`, `Driver`, `DailyAnalytics`, `RestaurantProfile` all defined in `src/types/orders.ts`

**Utilities**
- `formatCurrency()` (pence → GBP)
- `formatOrderTime()`, `formatTime()`, `minutesSince()`
- `getPlatformColors()`, `getStatusColors()`, `getPlatformLabel()`, `getStatusLabel()`
- `cn()` (clsx + tailwind-merge)
