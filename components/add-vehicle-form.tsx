'use client'

import { useState } from 'react'
import { useVehicles, type Vehicle } from '@/lib/vehicle-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function AddVehicleForm() {
  const { addVehicle } = useVehicles()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    miles: 0,
    color: '',
    pricePerDay: 100,
    minRentalDays: 1,
    deliveryFee: 0,
    pickupTimes: '9 AM - 6 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '',
    available: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.make || !formData.model || !formData.color) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData,
        approved: false,
      }

      addVehicle(newVehicle)
      toast.success('Vehicle added! Waiting for approval.')
      
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        miles: 0,
        color: '',
        pricePerDay: 100,
        minRentalDays: 1,
        deliveryFee: 0,
        pickupTimes: '9 AM - 6 PM',
        fuelType: 'Premium',
        seats: 5,
        image: '',
        available: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
        <CardDescription>Add a new vehicle to the rental fleet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Make *</label>
              <Input
                type="text"
                name="make"
                placeholder="e.g. Mercedes-Benz"
                value={formData.make}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model *</label>
              <Input
                type="text"
                name="model"
                placeholder="e.g. S-Class"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Miles</label>
              <Input
                type="number"
                name="miles"
                value={formData.miles}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color *</label>
              <Input
                type="text"
                name="color"
                placeholder="e.g. Obsidian Black"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price per Day ($)</label>
              <Input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Rental Days</label>
              <Input
                type="number"
                name="minRentalDays"
                value={formData.minRentalDays}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Fee ($)</label>
              <Input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Times</label>
              <Input
                type="text"
                name="pickupTimes"
                value={formData.pickupTimes}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <Input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <Input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input
                type="text"
                name="image"
                placeholder="e.g. /images/car.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
