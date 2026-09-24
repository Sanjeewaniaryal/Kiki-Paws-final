import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import Booking from '@/lib/models/Booking'
import Message from '@/lib/models/Message'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ count: 0 })

  await connectDB()
  const user = await User.findOne({ clerkId: userId }).lean()
  if (!user) return NextResponse.json({ count: 0 })

  const bookings = await Booking.find({
    $or: [{ ownerId: user._id }, { sitterId: user._id }],
  }).select('_id').lean()

  const bookingIds = bookings.map((b) => b._id)

  const count = await Message.countDocuments({
    bookingId: { $in: bookingIds },
    senderId: { $ne: user._id },
    readBy: { $ne: user._id },
  })

  return NextResponse.json({ count })
}
