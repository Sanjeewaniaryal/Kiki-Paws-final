import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/lib/models/Review'
import Booking from '@/lib/models/Booking'
import SitterProfile from '@/lib/models/SitterProfile'
import User from '@/lib/models/User'
import { averageRating, reviewBlockedReason, validateReviewInput } from '@/lib/reviews'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sitterProfileId = searchParams.get('sitterProfileId')
  if (!sitterProfileId) return NextResponse.json({ error: 'sitterProfileId required' }, { status: 400 })

  await connectDB()

  const reviews = await Review.find({ sitterProfileId })
    .populate('reviewerId', 'firstName lastName photo')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { bookingId, rating, comment } = body

  const invalid = validateReviewInput(body)
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })

  await connectDB()

  const reviewer = await User.findOne({ clerkId: userId })
  if (!reviewer) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const booking = await Booking.findById(bookingId)
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const blocked = reviewBlockedReason(booking, reviewer._id)
  if (blocked) return NextResponse.json({ error: blocked.error }, { status: blocked.status })

  const review = await Review.create({
    bookingId: booking._id,
    reviewerId: reviewer._id,
    sitterId: booking.sitterId,
    sitterProfileId: booking.sitterProfileId,
    rating,
    comment: comment?.trim() || undefined,
  })

  await Booking.findByIdAndUpdate(bookingId, { reviewed: true })

  const ratings = (await Review.find({ sitterProfileId: booking.sitterProfileId }, 'rating').lean())
    .map((r) => r.rating)

  await SitterProfile.findByIdAndUpdate(booking.sitterProfileId, {
    averageRating: averageRating(ratings),
    reviewCount: ratings.length,
  })

  return NextResponse.json(review, { status: 201 })
}
