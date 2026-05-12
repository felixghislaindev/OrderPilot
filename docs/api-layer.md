# OrderPilot API Layer (Internal Abstraction)

This layer normalizes all external delivery platforms into a single interface.

The system NEVER calls Uber or Deliveroo directly outside this layer.

==================================================
CORE PRINCIPLE
==================================================

All external complexity is hidden behind this API.

UI + CTO + PM agents ONLY interact with this layer.

==================================================
ORDER OPERATIONS
==================================================

createOrder(order)

acceptOrder(orderId)

rejectOrder(orderId)

updateOrderStatus(orderId, status)

getOrder(orderId)

listOrders(restaurantId)

==================================================
INTEGRATION OPERATIONS
==================================================

ingestPlatformOrder(platform, payload)

syncOrderStatus(platform, externalOrderId)

mapExternalOrderToInternal(payload)

==================================================
PLATFORM ADAPTERS (HIDDEN)
==================================================

UberEatsAdapter:
- transformUberOrder()
- sendStatusUpdate()
- receiveWebhook()

DeliverooAdapter:
- transformDeliverooOrder()
- sendStatusUpdate()
- receiveWebhook()

==================================================
RULES

1. Never expose raw platform payloads outside this layer
2. Always convert to Order data model
3. All logic must pass through this abstraction
4. If a platform feature is missing:
   → extend adapter, not UI or business logic
