import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { approved } = body

    const updated = await client
      .patch(id)
      .set({ approved })
      .commit()

    return NextResponse.json({
      id: updated._id,
      approved: updated.approved,
    })
  } catch (error) {
    console.error('Failed to update vehicle approval:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
