import { averageRating, reviewBlockedReason, validateReviewInput } from '@/lib/reviews'

describe('validateReviewInput', () => {
  it('rejects missing bookingId', () => {
    expect(validateReviewInput({ rating: 4 })).toBe('bookingId and rating are required')
  })

  it('rejects missing rating', () => {
    expect(validateReviewInput({ bookingId: 'abc' })).toBe('bookingId and rating are required')
  })

  it.each([-1, 6, 4.5, '5'])('rejects rating %p', (rating) => {
    expect(validateReviewInput({ bookingId: 'abc', rating })).toBe('Rating must be an integer 1–5')
  })

  it('rejects comment over 500 chars', () => {
    expect(validateReviewInput({ bookingId: 'abc', rating: 3, comment: 'x'.repeat(501) }))
      .toBe('Comment exceeds 500 characters')
  })

  it('accepts valid input with and without a comment', () => {
    expect(validateReviewInput({ bookingId: 'abc', rating: 5, comment: 'Great!' })).toBeNull()
    expect(validateReviewInput({ bookingId: 'abc', rating: 3 })).toBeNull()
  })
})

describe('reviewBlockedReason', () => {
  const completedBooking = { status: 'completed', ownerId: 'user1', reviewed: false }

  it('allows the owner to review a completed, unreviewed booking', () => {
    expect(reviewBlockedReason(completedBooking, 'user1')).toBeNull()
  })

  it('blocks review on a booking that is not completed', () => {
    expect(reviewBlockedReason({ ...completedBooking, status: 'active' }, 'user1'))
      .toEqual({ status: 400, error: 'Can only review completed bookings' })
  })

  it('blocks non-owners', () => {
    expect(reviewBlockedReason(completedBooking, 'user2'))
      .toEqual({ status: 403, error: 'Only the owner can leave a review' })
  })

  it('blocks duplicate reviews', () => {
    expect(reviewBlockedReason({ ...completedBooking, reviewed: true }, 'user1'))
      .toEqual({ status: 409, error: 'Booking already reviewed' })
  })

  it('compares ObjectId-like values by string', () => {
    const ownerId = { toString: () => 'user1' }
    expect(reviewBlockedReason({ ...completedBooking, ownerId }, 'user1')).toBeNull()
  })
})

describe('averageRating', () => {
  it('returns 0 when there are no ratings', () => {
    expect(averageRating([])).toBe(0)
  })

  it('rounds to one decimal place', () => {
    expect(averageRating([4])).toBe(4)
    expect(averageRating([5, 4])).toBe(4.5)
    expect(averageRating([5, 5, 4])).toBe(4.7)
  })
})
