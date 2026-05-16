import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return NextResponse.json([], { status: 200 })
    }

    const vehicles = await client.fetch(
      `*[_type == "vehicle"] | order(_createdAt desc) {
        _id,
        make,
        model,
        year,
        miles,
        color,
        pricePerDay,
        minRentalDays,
        deliveryFee,
        pickupTimes,
        fuelType,
        seats,
        available,
        image {
          asset -> {
            url
          }
        }
      }`
    )

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}
