'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useVehicles } from '@/lib/vehicle-context'
import { AdminLogin } from '@/components/admin-login'
import { AddVehicleForm } from '@/components/add-vehicle-form'
import { VehicleApprovalList } from '@/components/vehicle-approval-list'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth()
  const { vehicles } = useVehicles()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const pendingVehicles = vehicles.filter((v) => !v.approved)
  const approvedVehicles = vehicles.filter((v) => v.approved)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage vehicles and approvals</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Back to Site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingVehicles.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {pendingVehicles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedVehicles.length})
            </TabsTrigger>
            <TabsTrigger value="add">Add Vehicle</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-8">
            <VehicleApprovalList vehicles={pendingVehicles} />
          </TabsContent>

          <TabsContent value="approved" className="mt-8">
            <VehicleApprovalList vehicles={approvedVehicles} showActions={false} />
          </TabsContent>

          <TabsContent value="add" className="mt-8">
            <AddVehicleForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
