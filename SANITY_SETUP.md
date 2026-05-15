# Sanity Setup Guide

To enable image uploads to Sanity for the vehicle management system, follow these steps:

## 1. Create a Sanity Project

Visit [sanity.io](https://www.sanity.io) and create a new project if you don't have one already.

## 2. Get Your Credentials

1. Go to your Sanity project dashboard
2. Navigate to **Settings → API Credentials**
3. Copy your:
   - **Project ID**
   - **Dataset name** (usually `production`)

4. Generate an **API Token** with these permissions:
   - `documents.read`
   - `documents.write`
   - `assets.manage`

## 3. Add Environment Variables

Create or update your `.env.local` file with:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token
```

## 4. Test Image Upload

1. Navigate to `/admin` in your application
2. Login with password: `admin123`
3. Go to the "Add Vehicle" tab
4. Try uploading an image for a test vehicle

## Environment Variables Explanation

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID (public)
- `NEXT_PUBLIC_SANITY_DATASET`: The dataset to store assets in (public)
- `NEXT_PUBLIC_SANITY_API_VERSION`: Sanity API version (public)
- `SANITY_API_TOKEN`: API token for authentication (private, never commit this!)

## Troubleshooting

### "Sanity credentials not configured"
- Make sure all environment variables are set correctly
- Check that `SANITY_API_TOKEN` is set

### "Failed to upload image to Sanity"
- Verify your API token has the `assets.manage` permission
- Check that your project ID is correct
- Ensure your API token hasn't expired

### Images not appearing
- Verify the image URL is correct in the admin panel
- Check that images are being stored in Sanity (Settings → Assets)
