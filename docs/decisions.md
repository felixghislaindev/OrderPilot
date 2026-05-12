# OrderPilot Decisions

Key product and engineering decisions — what was decided, why, and what was traded off.

---

## D-001: No separate backend / no API layer

**Decision:** Single Next.js app. Route Handlers only if a server endpoint is strictly needed. Supabase handles all data and auth.

**Why:** Solo founder. A separate backend doubles the surface area to build, deploy, debug, and maintain. Supabase gives Postgres + auth + realtime without running a server. Next.js Route Handlers cover the edge cases (webhooks).

**Tradeoff:** Supabase is a vendor dependency. If it becomes limiting (custom business logic at scale, cost), extracting to a standalone backend later is clean — the domain types and Supabase client are already isolated.

---

## D-002: Mock data first, Supabase second

**Decision:** Ship the full frontend UI on mock data before wiring any real backend.

**Why:** Frontend work (layout, components, interactions) is the highest-value signal for whether the product makes sense. Wiring Supabase first would have blocked UI progress on schema design and auth setup.

**Tradeoff:** Demo mode is not a shippable product. Every mock-data import in the codebase is tech debt until Supabase is wired. Acceptable — the frontend is now complete and unblocked.

---

## D-003: Dark-first, no `dark:` variants

**Decision:** All colors are hardcoded for dark mode. No light mode, no `dark:` Tailwind variants.

**Why:** Restaurant kitchens run in dark environments or on tablets with dimmed screens. Dark mode is the primary use case. A light mode would add design complexity with no clear user demand at this stage.

**Tradeoff:** Light mode would need a full restyle if ever required. Low risk — the restaurant ops market skews toward dark UI anyway (Linear, Notion, Raycast influence).

---

## D-004: Currency in pence (integer), not float

**Decision:** All monetary values stored and computed as integers in pence (e.g. `1290` = £12.90). `formatCurrency()` handles display.

**Why:** Floating point arithmetic on money causes rounding bugs. Integer pence is the industry standard for UK commerce. Consistent with what Stripe, Deliveroo, and Uber Eats APIs actually send.

**Tradeoff:** All data inputs (webhooks, manual entry) must convert to pence at the boundary. A future schema migration would be painful if this convention is violated.

---

## D-005: `OrderStatus` as a linear state machine

**Decision:** Status transitions follow a strict sequence: `pending → confirmed → preparing → ready → picked_up → delivered`. `cancelled` is a terminal state reachable from any step. No skipping allowed in the UI.

**Why:** Linear flow maps to kitchen reality. A restaurant can't mark something "ready" without having prepped it. Enforcing the sequence in the UI prevents operator mistakes and makes analytics (time-in-state) reliable.

**Tradeoff:** Platform APIs (Uber Eats, Deliveroo) may send out-of-sequence status updates. Webhook normalization will need to handle or discard these gracefully.

---

## D-006: Vercel for deployment

**Decision:** Vercel as the deployment platform from day one.

**Why:** Zero-config Next.js deploys. `git push` = live. Preview URLs for every PR. No DevOps work. Supabase + Vercel is the canonical modern stack for this kind of SaaS.

**Tradeoff:** Vercel costs more than a raw VPS at scale. Not a concern pre-revenue. Acceptable vendor dependency given the speed advantage.

---

## D-007: shadcn/ui over a full component library

**Decision:** shadcn/ui (copy-paste components) over MUI, Ant Design, or Mantine.

**Why:** shadcn gives full control over markup and styling with no hidden overrides. Tailwind v4 + shadcn is the path of least resistance for the design direction (dark, dense, operational). No bundle bloat from unused components.

**Tradeoff:** More initial setup per component. Justified by the long-term flexibility and the fact that this dashboard has a very specific design language that generic component libraries would fight against.

---

## D-008: Multi-restaurant architecture from the start

**Decision:** `restaurant_id` is on every `Order`. Supabase RLS will scope all queries by restaurant.

**Why:** Building single-tenant first and adding multi-tenancy later is a painful migration. Adding `restaurant_id` to the type system now costs nothing and makes the future correct by default.

**Tradeoff:** Slightly more schema complexity upfront. Worth it — the entire business model requires multi-restaurant SaaS.
