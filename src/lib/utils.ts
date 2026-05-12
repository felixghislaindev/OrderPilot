import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import type { Platform, OrderStatus } from '@/types/orders'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOrderTime(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}

export function formatCurrency(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm')
}

export function minutesSince(isoString: string): number {
  return Math.floor((Date.now() - parseISO(isoString).getTime()) / 60000)
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    uber_eats: 'Uber Eats',
    deliveroo: 'Deliveroo',
    just_eat: 'Just Eat',
    direct: 'Direct',
  }
  return labels[platform]
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    picked_up: 'Picked Up',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function getPlatformColors(platform: Platform): string {
  const colors: Record<Platform, string> = {
    uber_eats: 'bg-zinc-100/10 text-zinc-200 border-zinc-100/20',
    deliveroo: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    just_eat: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    direct: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return colors[platform]
}

export function getStatusColors(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    preparing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ready: 'bg-green-500/10 text-green-400 border-green-500/20',
    picked_up: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return colors[status]
}
