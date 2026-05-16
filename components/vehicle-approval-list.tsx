'use client'

import { useVehicles, type Vehicle } from '@/lib/vehicle-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface VehicleApprovalListProps {
  vehicles: Vehicle[]
  showActions?: boolean
}

export function VehicleApprovalList({
  vehicles,
  showActions = true,
}: VehicleApprovalListProps) {
  const { approveVehicle, rejectVehicle, deleteVehicle } = useVehicles()

  const handleApprove = async (id: string) => {
    try {
      await approveVehicle(id)
      toast.success('Vehicle approved!')
    } catch (error) {
      toast.error('Failed to approve vehicle')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectVehicle(id)
      toast.success('Vehicle rejected')
    } catch (error) {
      toast.error('Failed to reject vehicle')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id)
      toast.success('Vehicle deleted')
    } catch (error) {
      toast.error('Failed to delete vehicle')
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No vehicles to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{vehicle.color}</Badge>
                  <Badge variant="outline">{vehicle.seats} seats</Badge>
                  <Badge variant="outline">{vehicle.fuelType}</Badge>
                </div>
              </div>
              {vehicle.approved && (
                <Badge className="bg-green-600">Approved</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Miles</p>
                <p className="font-semibold">{vehicle.miles.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price per Day</p>
                <p className="font-semibold">${vehicle.pricePerDay}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Min Days</p>
                <p className="font-semibold">{vehicle.minRentalDays}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivery Fee</p>
                <p className="font-semibold">${vehicle.deliveryFee}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pickup Times</p>
                <p className="font-semibold text-sm">{vehicle.pickupTimes}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold">
                  {vehicle.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>

            {showActions && !vehicle.approved && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(vehicle.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(vehicle.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}

            {showActions && vehicle.approved && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(vehicle.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
