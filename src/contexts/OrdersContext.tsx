'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Order, OrderStatus, RestaurantProfile } from '@/types/orders'
import { fetchOrders, updateOrderStatus, subscribeToOrders } from '@/lib/supabase/queries'

type OrdersContextValue = {
  orders: Order[]
  restaurant: RestaurantProfile | null
  loading: boolean
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}

export function OrdersProvider({
  restaurantId,
  restaurant,
  children,
}: {
  restaurantId: string
  restaurant: RestaurantProfile
  children: React.ReactNode
}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    const data = await fetchOrders(restaurantId)
    setOrders(data)
    setLoading(false)
  }, [restaurantId])

  useEffect(() => {
    loadOrders()
    const channel = subscribeToOrders(restaurantId, loadOrders)
    return () => { channel.unsubscribe() }
  }, [restaurantId, loadOrders])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    await updateOrderStatus(orderId, newStatus)
  }

  return (
    <OrdersContext.Provider value={{ orders, restaurant, loading, handleStatusChange }}>
      {children}
    </OrdersContext.Provider>
  )
}
