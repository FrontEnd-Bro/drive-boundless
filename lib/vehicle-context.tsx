'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  miles: number
  color: string
  pricePerDay: number
  minRentalDays: number
  deliveryFee: number
  pickupTimes: string
  fuelType: string
  seats: number
  image?: string
  available: boolean
  approved: boolean
}

interface VehicleContextType {
  vehicles: Vehicle[]
  loading: boolean
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'approved'> & { imageUrl: string }) => Promise<Vehicle>
  approveVehicle: (id: string) => Promise<void>
  rejectVehicle: (id: string) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
  refreshVehicles: () => Promise<void>
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      if (!response.ok) throw new Error('Failed to fetch vehicles')
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'approved'> & { imageUrl: string }): Promise<Vehicle> => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          miles: vehicleData.miles,
          color: vehicleData.color,
          pricePerDay: vehicleData.pricePerDay,
          minRentalDays: vehicleData.minRentalDays,
          deliveryFee: vehicleData.deliveryFee,
          pickupTimes: vehicleData.pickupTimes,
          fuelType: vehicleData.fuelType,
          seats: vehicleData.seats,
          imageUrl: vehicleData.imageUrl,
        }),
      })

      if (!response.ok) throw new Error('Failed to add vehicle')
      const newVehicle = await response.json()
      setVehicles([...vehicles, newVehicle])
      return newVehicle
    } catch (error) {
      console.error('Error adding vehicle:', error)
      throw error
    }
  }

  const approveVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      })

      if (!response.ok) throw new Error('Failed to approve vehicle')
      const updated = await response.json()
      setVehicles(vehicles.map((v) => (v.id === id ? { ...v, approved: updated.approved } : v)))
    } catch (error) {
      console.error('Error approving vehicle:', error)
      throw error
    }
  }

  const rejectVehicle = async (id: string) => {
    try {
      await fetch(`/api/vehicles/${id}/approve`, { method: 'DELETE' })
      setVehicles(vehicles.filter((v) => v.id !== id))
    } catch (error) {
      console.error('Error rejecting vehicle:', error)
      throw error
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      await fetch(`/api/vehicles/${id}/approve`, { method: 'DELETE' })
      setVehicles(vehicles.filter((v) => v.id !== id))
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  }

  const refreshVehicles = async () => {
    await fetchVehicles()
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        addVehicle,
        approveVehicle,
        rejectVehicle,
        deleteVehicle,
        refreshVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehicleContext)
  if (!context) {
    throw new Error('useVehicles must be used within VehicleProvider')
  }
  return context
}
