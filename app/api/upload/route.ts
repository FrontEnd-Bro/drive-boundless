import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN

    if (!projectId || !token) {
      return NextResponse.json(
        { error: 'Sanity credentials not configured' },
        { status: 500 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadFormData = new FormData()
    uploadFormData.append('file', new Blob([buffer], { type: file.type }), file.name)

    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Sanity upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload image to Sanity' },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ url: data.document.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}
