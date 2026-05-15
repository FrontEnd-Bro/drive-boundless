'use client'

import { useState } from 'react'
import { useVehicles, type Vehicle } from '@/lib/vehicle-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'

export function AddVehicleForm() {
  const { addVehicle } = useVehicles()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Set preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setImageFile(file)

    // Upload to Sanity
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Make sure Sanity credentials are configured.')
      setImagePreview('')
      setImageFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.make || !formData.model || !formData.color) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.image) {
      toast.error('Please upload an image')
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
      setImageFile(null)
      setImagePreview('')
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Vehicle Image *</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <p className="text-sm text-muted-foreground">
                      {imageFile?.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview('')
                        setImageFile(null)
                        setFormData((prev) => ({ ...prev, image: '' }))
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <label className="cursor-pointer">
                      <span className="text-sm font-medium">Click to upload</span>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading || uploading}>
            {loading ? 'Adding...' : uploading ? 'Uploading...' : 'Add Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
