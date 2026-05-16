# Sanity Integration Guide

## Overview

The Drive Boundless application now reads all vehicles directly from Sanity CMS. The admin section has been completely removed, and the vehicle management is now handled entirely through Sanity.

## Setup Required

To get vehicles displaying in your app, you need to:

### 1. Set Environment Variables

Add these environment variables to your Vercel project settings:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token
```

### 2. Create Sanity Schema

In your Sanity project, create a `vehicle` schema with these fields:

```javascript
{
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    {
      name: 'make',
      title: 'Make',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'miles',
      title: 'Miles',
      type: 'number'
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string'
    },
    {
      name: 'pricePerDay',
      title: 'Price Per Day',
      type: 'number',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'minRentalDays',
      title: 'Minimum Rental Days',
      type: 'number'
    },
    {
      name: 'deliveryFee',
      title: 'Delivery Fee',
      type: 'number'
    },
    {
      name: 'pickupTimes',
      title: 'Pickup Times',
      type: 'string'
    },
    {
      name: 'fuelType',
      title: 'Fuel Type',
      type: 'string'
    },
    {
      name: 'seats',
      title: 'Number of Seats',
      type: 'number'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true
    }
  ]
}
```

### 3. Add Vehicles in Sanity Studio

1. Log in to your Sanity Studio
2. Create new documents of type "vehicle"
3. Fill in all the required fields
4. Upload vehicle images
5. Publish the documents

## How It Works

- **Vehicle Display**: The `/vehicles` and `/rent` pages fetch all vehicles from Sanity via `/api/vehicles` endpoint
- **Vehicle Selection**: Users can select vehicles from the fleet to rent
- **Data Format**: Vehicles use Sanity's native `_id` field and nested image asset structure
- **Image Handling**: Images are stored and served directly from Sanity's asset pipeline

## API Endpoints

### GET /api/vehicles
Fetches all published vehicles from Sanity.

Returns:
```json
[
  {
    "_id": "document-id",
    "make": "Mercedes-Benz",
    "model": "S-Class",
    "year": 2024,
    "miles": 12500,
    "color": "Obsidian Black",
    "pricePerDay": 250,
    "minRentalDays": 2,
    "deliveryFee": 50,
    "pickupTimes": "9 AM - 6 PM",
    "fuelType": "Premium",
    "seats": 5,
    "available": true,
    "image": {
      "asset": {
        "url": "https://cdn.sanity.io/images/..."
      }
    }
  }
]
```

## File Changes

### Removed
- `/app/admin/*` - Complete admin section
- `/components/admin-login.tsx`
- `/components/add-vehicle-form.tsx`
- `/components/vehicle-approval-list.tsx`
- `/lib/auth-context.tsx`
- `/app/api/vehicles/[id]/approve/route.ts` - Approval API

### Updated
- `/lib/vehicle-context.tsx` - Simplified to read-only mode
- `/lib/sanity.ts` - Enhanced error handling for missing config
- `/app/api/vehicles/route.ts` - Now only fetches from Sanity
- `/components/vehicle-fleet.tsx` - Updated to use Sanity vehicle interface
- `/components/header.tsx` - Removed admin panel link
- `/app/layout.tsx` - Removed AuthProvider

## Troubleshooting

**Vehicles not showing?**
- Verify environment variables are set correctly
- Check that documents are published in Sanity
- Look at browser console for fetch errors

**Images not loading?**
- Ensure images are properly uploaded in Sanity
- Check that asset references are correct
- Verify Sanity API token has image asset read permissions
