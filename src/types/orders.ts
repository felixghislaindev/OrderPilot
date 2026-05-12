export type Platform = 'uber_eats' | 'deliveroo' | 'just_eat' | 'direct'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

export interface Driver {
  name: string
  phone?: string
  eta_minutes?: number
  rating?: number
}

export interface Order {
  id: string
  display_id: string
  platform: Platform
  status: OrderStatus
  customer_name: string
  customer_phone?: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  placed_at: string
  confirmed_at?: string
  prep_started_at?: string
  ready_at?: string
  picked_up_at?: string
  delivered_at?: string
  estimated_prep_minutes: number
  delivery_address?: string
  driver?: Driver
  notes?: string
  restaurant_id: string
  is_urgent?: boolean
}

export interface DailyAnalytics {
  date: string
  total_orders: number
  revenue: number
  avg_prep_time_minutes: number
  on_time_rate: number
  cancelled_orders: number
  platform_breakdown: PlatformBreakdown[]
}

export interface PlatformBreakdown {
  platform: Platform
  orders: number
  revenue: number
}

export interface RestaurantProfile {
  id: string
  name: string
  logo_url?: string
  timezone: string
  platforms: Platform[]
}
