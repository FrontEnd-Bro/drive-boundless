import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
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
        approved,
        available,
        image {
          asset -> {
            url
          }
        }
      }`
    )

    const formattedVehicles = vehicles.map((v: any) => ({
      id: v._id,
      make: v.make,
      model: v.model,
      year: v.year,
      miles: v.miles,
      color: v.color,
      pricePerDay: v.pricePerDay,
      minRentalDays: v.minRentalDays,
      deliveryFee: v.deliveryFee,
      pickupTimes: v.pickupTimes,
      fuelType: v.fuelType,
      seats: v.seats,
      approved: v.approved || false,
      available: v.available !== false,
      image: v.image?.asset?.url || '',
    }))

    return NextResponse.json(formattedVehicles)
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { make, model, year, miles, color, pricePerDay, minRentalDays, deliveryFee, pickupTimes, fuelType, seats, imageUrl } = body

    if (!make || !model || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create vehicle document in Sanity
    const document = {
      _type: 'vehicle',
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
      approved: false,
      available: true,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageUrl.split('/').pop().split('.')[0], // Extract Sanity asset ID from URL
        },
      },
    }

    const result = await client.create(document)

    return NextResponse.json({
      id: result._id,
      ...body,
      approved: false,
      available: true,
    })
  } catch (error) {
    console.error('Failed to create vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
