# OrderPilot Data Model (Single Source of Truth)

This is the canonical data model for the entire OrderPilot system.

ALL systems MUST conform to this model:
- UI
- API layer
- integrations (Uber Eats / Deliveroo)
- Supabase schema
- AI agents (PM + CTO)

If something does not fit this model:
→ propose an update to this document FIRST before implementing.

==================================================
ORDER
==================================================

Represents a single food delivery order from any platform.

Order {
  id: string
  externalOrderId: string
  platform: "uber" | "deliveroo" | "manual"

  restaurantId: string

  status:
    | "new"
    | "accepted"
    | "rejected"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"

  items: OrderItem[]

  pricing: {
    currency: string
    subtotal: number
    deliveryFee: number
    total: number
  }

  customer: {
    name?: string
    phone?: string
    notes?: string
  }

  timing: {
    createdAt: string
    acceptedAt?: string
    preparationStartAt?: string
    readyAt?: string
    deliveredAt?: string
  }

  metadata: {
    rawPlatformPayload: unknown
  }
}

==================================================
ORDER ITEM
==================================================

OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

==================================================
RESTAURANT
==================================================

Restaurant {
  id: string
  name: string

  platformConnections: {
    uberEats: boolean
    deliveroo: boolean
  }

  settings: {
    autoAcceptOrders: boolean
    averagePrepTimeMinutes: number
  }
}

==================================================
ORDER EVENT (REALTIME SYSTEM)
==================================================

Used for future realtime updates and audit trail.

OrderEvent {
  id: string
  orderId: string

  type:
    | "order_created"
    | "order_updated"
    | "status_changed"

  timestamp: string

  payload: unknown
}

==================================================
SYSTEM RULES
==================================================

1. This model is the ONLY source of truth
2. APIs must map into this model (never bypass it)
3. UI must render from this model only
4. External platforms must be normalized into this model
5. If a platform field does not exist here:
   → propose extension, do NOT improvise in code
