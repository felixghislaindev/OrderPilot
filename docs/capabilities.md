# OrderPilot Capabilities

This defines what the system CAN and CANNOT do.

==================================================
WHAT WE CAN DO (MVP)
==================================================

Orders:
- Receive orders from Uber Eats (via webhook)
- Receive orders from Deliveroo (via webhook)
- Accept / reject orders
- Update order status lifecycle
- Display live orders in dashboard

Dashboard:
- Show active orders
- Show order status pipeline
- Show kitchen queue
- Show basic analytics (mock or real later)

Authentication:
- Restaurant login via Supabase Auth

Data:
- Persist orders in database
- Store platform payloads (raw + normalized)

==================================================
WHAT WE CANNOT DO (YET)
==================================================

- ❌ No driver tracking system control
- ❌ No control over Uber/Deliveroo dispatch logic
- ❌ No payment processing
- ❌ No marketplace features
- ❌ No predictive AI logic (future phase)
- ❌ No multi-region orchestration

==================================================
INTEGRATIONS

External platforms are EVENT SOURCES ONLY:
- Uber Eats → order events
- Deliveroo → order events

We do NOT control their internal systems.

==================================================
ARCHITECTURE RULE

If something is not in this file:
→ it does NOT exist in the system yet
→ must be explicitly designed before implementation
