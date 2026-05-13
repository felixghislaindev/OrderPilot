import type { Order, OrderStatus, RestaurantProfile } from '@/types/orders'
import { createClient } from './client'

type DbOrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  notes: string | null
}

type DbOrder = {
  id: string
  restaurant_id: string
  display_id: string
  platform: string
  status: string
  customer_name: string
  customer_phone: string | null
  subtotal: number
  delivery_fee: number
  total: number
  placed_at: string
  confirmed_at: string | null
  prep_started_at: string | null
  ready_at: string | null
  picked_up_at: string | null
  delivered_at: string | null
  estimated_prep_minutes: number
  delivery_address: string | null
  notes: string | null
  is_urgent: boolean
  driver_name: string | null
  driver_phone: string | null
  driver_eta_minutes: number | null
  driver_rating: number | null
  order_items: DbOrderItem[]
}

function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    display_id: row.display_id,
    platform: row.platform as Order['platform'],
    status: row.status as OrderStatus,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone ?? undefined,
    items: row.order_items.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      notes: i.notes ?? undefined,
    })),
    subtotal: row.subtotal,
    delivery_fee: row.delivery_fee,
    total: row.total,
    placed_at: row.placed_at,
    confirmed_at: row.confirmed_at ?? undefined,
    prep_started_at: row.prep_started_at ?? undefined,
    ready_at: row.ready_at ?? undefined,
    picked_up_at: row.picked_up_at ?? undefined,
    delivered_at: row.delivered_at ?? undefined,
    estimated_prep_minutes: row.estimated_prep_minutes,
    delivery_address: row.delivery_address ?? undefined,
    notes: row.notes ?? undefined,
    is_urgent: row.is_urgent,
    restaurant_id: row.restaurant_id,
    driver: row.driver_name
      ? {
          name: row.driver_name,
          phone: row.driver_phone ?? undefined,
          eta_minutes: row.driver_eta_minutes ?? undefined,
          rating: row.driver_rating ?? undefined,
        }
      : undefined,
  }
}

export async function fetchOrders(restaurantId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('restaurant_id', restaurantId)
    .order('placed_at', { ascending: false })

  if (error) throw error
  return (data as DbOrder[]).map(mapOrder)
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = createClient()
  const timestamps: Record<string, string> = {}
  if (status === 'confirmed') timestamps.confirmed_at = new Date().toISOString()
  if (status === 'preparing') timestamps.prep_started_at = new Date().toISOString()
  if (status === 'ready') timestamps.ready_at = new Date().toISOString()
  if (status === 'picked_up') timestamps.picked_up_at = new Date().toISOString()
  if (status === 'delivered') timestamps.delivered_at = new Date().toISOString()

  const { error } = await supabase
    .from('orders')
    .update({ status, ...timestamps })
    .eq('id', orderId)

  if (error) throw error
}

export function subscribeToOrders(
  restaurantId: string,
  onUpdate: () => void
) {
  const supabase = createClient()
  return supabase
    .channel(`orders:${restaurantId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
      onUpdate
    )
    .subscribe()
}

export async function fetchRestaurant(userId: string): Promise<RestaurantProfile | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('restaurants')
    .select('id, name, timezone, platforms, logo_url')
    .eq('owner_id', userId)
    .single()

  if (!data) return null
  return {
    id: data.id,
    name: data.name,
    timezone: data.timezone,
    platforms: data.platforms,
    logo_url: data.logo_url ?? undefined,
  }
}
