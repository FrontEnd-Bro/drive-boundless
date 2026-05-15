"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { VehicleFleet, type Vehicle } from "@/components/vehicle-fleet"
import { RentalForm } from "@/components/rental-form"
import { Footer } from "@/components/footer"

export default function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    // Smooth scroll to rental form
    setTimeout(() => {
      document.getElementById("rent")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <VehicleFleet onSelectVehicle={handleSelectVehicle} />
        <RentalForm selectedVehicle={selectedVehicle} />
      </main>
      <Footer />
    </>
  )
}
