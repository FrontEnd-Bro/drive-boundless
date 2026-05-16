"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fuel, Users, Gauge, Check } from "lucide-react"
import { useVehicles, type Vehicle } from "@/lib/vehicle-context"



interface VehicleFleetProps {
  onSelectVehicle?: (vehicle: Vehicle) => void
}

export function VehicleFleet({ onSelectVehicle }: VehicleFleetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { vehicles } = useVehicles()

  const handleSelect = (vehicle: Vehicle) => {
    setSelectedId(vehicle._id)
    onSelectVehicle?.(vehicle)
    toast.success("Vehicle selected", {
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.pricePerDay}/day`,
    })
  }

  return (
    <section id="vehicles" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-accent mb-4">
            Our Fleet
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-6 text-balance">
            Available <span className="italic">vehicles</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Browse our collection of premium vehicles. Each car is meticulously 
            maintained and ready for your next journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle._id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedId === vehicle._id ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => handleSelect(vehicle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {vehicle.year}
                    </p>
                    <CardTitle className="font-serif text-xl">
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                  </div>
                  {vehicle.available && (
                    <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                      Available
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Vehicle Image */}
                <div className="aspect-[16/10] bg-muted rounded-lg mb-4 overflow-hidden relative">
                  {vehicle.image?.asset?.url ? (
                    <Image
                      src={vehicle.image.asset.url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground/30">🚗</span>
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Fuel className="h-4 w-4" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>{(vehicle.miles / 1000).toFixed(0)}k mi</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min. rental</span>
                    <span className="font-medium">{vehicle.minRentalDays} day{vehicle.minRentalDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup times</span>
                    <span className="font-medium">{vehicle.pickupTimes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span className="font-medium">${vehicle.deliveryFee}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-end justify-between mt-6 pt-4 border-t border-border">
                  <div>
                    <p className="font-serif text-2xl font-medium">${vehicle.pricePerDay}</p>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </div>
                  <Button 
                    size="sm"
                    className={selectedId === vehicle.id ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    {selectedId === vehicle.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
