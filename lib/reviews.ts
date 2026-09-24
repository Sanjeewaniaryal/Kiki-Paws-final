export const MAX_COMMENT_LENGTH = 500

type ReviewInput = { bookingId?: unknown; rating?: unknown; comment?: unknown }

type ReviewableBooking = { status: string; ownerId: unknown; reviewed: boolean }

export function validateReviewInput({ bookingId, rating, comment }: ReviewInput): string | null {
  if (!bookingId || !rating) return 'bookingId and rating are required'
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return 'Rating must be an integer 1–5'
  }
  if (typeof comment === 'string' && comment.length > MAX_COMMENT_LENGTH) {
    return `Comment exceeds ${MAX_COMMENT_LENGTH} characters`
  }
  return null
}

export function reviewBlockedReason(booking: ReviewableBooking, reviewerId: unknown) {
  if (booking.status !== 'completed') return { status: 400, error: 'Can only review completed bookings' }
  if (String(booking.ownerId) !== String(reviewerId)) return { status: 403, error: 'Only the owner can leave a review' }
  if (booking.reviewed) return { status: 409, error: 'Booking already reviewed' }
  return null
}

export function averageRating(ratings: number[]) {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((a, b) => a + b, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}
