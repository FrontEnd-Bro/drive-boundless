'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Vehicle {
  _id: string
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
  image?: {
    asset: {
      url: string
    }
  }
  available: boolean
}

interface VehicleContextType {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/vehicles')
        if (!response.ok) throw new Error('Failed to fetch vehicles')
        const data = await response.json()
        setVehicles(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching vehicles:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        error,
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
