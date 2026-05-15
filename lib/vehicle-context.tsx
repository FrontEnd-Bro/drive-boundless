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
  addVehicle: (vehicle: Vehicle) => void
  approveVehicle: (id: string) => void
  rejectVehicle: (id: string) => void
  deleteVehicle: (id: string) => void
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: '1',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    miles: 12500,
    color: 'Obsidian Black',
    pricePerDay: 250,
    minRentalDays: 2,
    deliveryFee: 50,
    pickupTimes: '9 AM - 6 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '/images/mercedes-s-class.jpg',
    available: true,
    approved: true,
  },
  {
    id: '2',
    make: 'BMW',
    model: '7 Series',
    year: 2024,
    miles: 8200,
    color: 'Alpine White',
    pricePerDay: 220,
    minRentalDays: 2,
    deliveryFee: 50,
    pickupTimes: '9 AM - 6 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '/images/bmw-7-series.jpg',
    available: true,
    approved: true,
  },
  {
    id: '3',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2023,
    miles: 18300,
    color: 'Chalk Grey',
    pricePerDay: 280,
    minRentalDays: 3,
    deliveryFee: 75,
    pickupTimes: '10 AM - 5 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '/images/porsche-cayenne.jpg',
    available: true,
    approved: true,
  },
  {
    id: '4',
    make: 'Audi',
    model: 'A8',
    year: 2024,
    miles: 5600,
    color: 'Mythos Black',
    pricePerDay: 200,
    minRentalDays: 1,
    deliveryFee: 40,
    pickupTimes: '8 AM - 7 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '/images/audi-a8.jpg',
    available: true,
    approved: true,
  },
  {
    id: '5',
    make: 'Range Rover',
    model: 'Sport',
    year: 2024,
    miles: 9800,
    color: 'Santorini Black',
    pricePerDay: 300,
    minRentalDays: 2,
    deliveryFee: 60,
    pickupTimes: '9 AM - 6 PM',
    fuelType: 'Premium',
    seats: 5,
    image: '/images/range-rover-sport.jpg',
    available: true,
    approved: true,
  },
]

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('vehicles')
    if (stored) {
      try {
        setVehicles(JSON.parse(stored))
      } catch {
        setVehicles(DEFAULT_VEHICLES)
      }
    } else {
      setVehicles(DEFAULT_VEHICLES)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vehicles', JSON.stringify(vehicles))
    }
  }, [vehicles, mounted])

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle])
  }

  const approveVehicle = (id: string) => {
    setVehicles(
      vehicles.map((v) => (v.id === id ? { ...v, approved: true } : v))
    )
  }

  const rejectVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  const updateVehicle = (id: string, updatedData: Partial<Vehicle>) => {
    setVehicles(
      vehicles.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    )
  }

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        approveVehicle,
        rejectVehicle,
        deleteVehicle,
        updateVehicle,
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
