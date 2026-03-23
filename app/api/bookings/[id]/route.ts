import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Booking from '@/lib/models/Booking'
import User from '@/lib/models/User'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  await connectDB()

  const user = await User.findOne({ clerkId: userId })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const booking = await Booking.findById(id)
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  // Only sitter can accept/decline, only owner can cancel
  const isSitter = booking.sitterId.toString() === user._id.toString()
  const isOwner = booking.ownerId.toString() === user._id.toString()

  if (['accepted', 'declined', 'active', 'completed'].includes(status) && !isSitter) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (status === 'cancelled' && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  booking.status = status
  await booking.save()

  return NextResponse.json(booking)
}
