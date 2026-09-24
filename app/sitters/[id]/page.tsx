'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import StarRating from '@/components/StarRating'
import BookingModal from '../BookingModal'
import Navbar, { BackLink } from '@/components/Navbar'
import { DAYS, DAY_LABELS, serviceLabel } from '@/lib/constants'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import { Star } from 'lucide-react'

interface DayAvail { available: boolean; from: string; to: string }

interface SitterProfile {
  _id: string
  bio: string
  services: string[]
  hourlyRate: number
  location: string
  experience: string
  averageRating: number
  reviewCount: number
  profilePhoto?: string
  availability?: Record<string, DayAvail>
  userId: { firstName: string; lastName: string; photo: string; location: string }
}

interface Review {
  _id: string
  rating: number
  comment?: string
  createdAt: string
  reviewerId: { firstName: string; lastName: string; photo: string }
}

function formatTime(t: string) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default function SitterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<SitterProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetch(`/api/sitters/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile)
        setReviews(data.reviews || [])
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted">Loading…</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Sitter not found</p>
          <Link href="/sitters" className="mt-2 inline-block text-sm text-primary">← Back to sitters</Link>
        </div>
      </div>
    )
  }

  const availDays = DAYS.filter((d) => profile.availability?.[d]?.available)

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <BackLink href="/sitters">All Sitters</BackLink>
      </Navbar>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">

        <div className="rounded-3xl p-8 shadow-sm bg-white border border-border">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar src={profile.profilePhoto || profile.userId.photo} alt={profile.userId.firstName} size={96} />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {profile.userId.firstName} {profile.userId.lastName}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {profile.location || profile.userId.location || 'Location not set'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StarRating value={profile.averageRating} size="md" />
                <span className="text-sm text-muted">
                  {profile.averageRating > 0
                    ? `${profile.averageRating.toFixed(1)} · ${profile.reviewCount} review${profile.reviewCount !== 1 ? 's' : ''}`
                    : 'No reviews yet'}
                </span>
              </div>
              {profile.experience && (
                <p className="mt-2 text-sm text-muted">{profile.experience} experience</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-shrink-0">
              <p className="text-2xl font-bold text-primary">
                {profile.hourlyRate > 0 ? `$${profile.hourlyRate}` : '—'}
                <span className="text-sm font-normal text-muted">/hr</span>
              </p>
              <button
                onClick={() => setBooking(true)}
                className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white bg-primary"
              >
                Book Now
              </button>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-6 text-sm leading-relaxed text-foreground">{profile.bio}</p>
          )}
        </div>

        {profile.services.length > 0 && (
          <div className="mt-6 rounded-3xl p-6 shadow-sm bg-white border border-border">
            <h2 className="mb-4 text-base font-semibold text-foreground">Services</h2>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((s) => (
                <span key={s} className="rounded-full px-3 py-1.5 text-sm font-medium bg-violet-50 text-primary">
                  {serviceLabel(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {availDays.length > 0 && (
          <div className="mt-6 rounded-3xl p-6 shadow-sm bg-white border border-border">
            <h2 className="mb-4 text-base font-semibold text-foreground">Weekly Availability</h2>
            <div className="space-y-2">
              {availDays.map((d) => {
                const day = profile.availability![d]
                return (
                  <div key={d} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-green-50 border border-green-200">
                    <span className="text-sm font-medium text-foreground">{DAY_LABELS[d]}</span>
                    <span className="text-sm text-green-800">
                      {formatTime(day.from)} – {formatTime(day.to)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-3xl p-6 shadow-sm bg-white border border-border">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Reviews {reviews.length > 0 && <span className="text-muted">({reviews.length})</span>}
          </h2>

          {reviews.length === 0 ? (
            <div className="rounded-2xl py-10 text-center bg-gray-50">
              <Star size={28} className="shrink-0 text-primary" aria-hidden />
              <p className="mt-2 text-sm text-muted">No reviews yet — be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-2xl p-4 bg-gray-50 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={r.reviewerId.photo} alt={r.reviewerId.firstName} size={32} />
                      <span className="text-sm font-medium text-foreground">
                        {r.reviewerId.firstName} {r.reviewerId.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} size="sm" />
                      <span className="text-xs text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {booking && <BookingModal sitter={profile} onClose={() => setBooking(false)} />}
    </div>
  )
}
