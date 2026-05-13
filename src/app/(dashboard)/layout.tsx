import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrdersProvider } from '@/contexts/OrdersContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, timezone, platforms, logo_url')
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) redirect('/login')

  return (
    <OrdersProvider restaurantId={restaurant.id} restaurant={restaurant}>
      <div className="flex h-screen bg-zinc-950 overflow-hidden">
        <Sidebar restaurantName={restaurant.name} />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </OrdersProvider>
  )
}
