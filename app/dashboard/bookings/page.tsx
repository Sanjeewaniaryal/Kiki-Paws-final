'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatDrawer from './ChatDrawer'
import ReviewModal from './ReviewModal'
import Navbar, { BackLink } from '@/components/Navbar'
import { BOOKING_STATUS, serviceLabel } from '@/lib/constants'
import Link from 'next/link'
import { PawPrint } from 'lucide-react'

interface Booking {
  _id: string
  service: string
  startDate: string
  endDate: string
  status: string
  totalPrice: number
  notes?: string
  reviewed: boolean
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  petId: { name: string; breed: string }
  sitterId?: { firstName: string; lastName: string; photo: string }
  ownerId?: { firstName: string; lastName: string; photo: string }
}

function PaymentToast({ onToast }: { onToast: (t: { msg: string; ok: boolean } | null) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') onToast({ msg: 'Payment successful. Your booking is now active.', ok: true })
    if (payment === 'cancelled') onToast({ msg: 'Payment cancelled — your booking is still pending.', ok: false })
    if (payment) setTimeout(() => onToast(null), 5000)
  }, [searchParams, onToast])
  return null
}

export default function BookingsPage() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [asOwner, setAsOwner] = useState<Booking[]>([])
  const [asSitter, setAsSitter] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'owner' | 'sitter'>('owner')
  const [chat, setChat] = useState<{ bookingId: string; otherName: string } | null>(null)
  const [review, setReview] = useState<{ bookingId: string; sitterName: string } | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [refundingId, setRefundingId] = useState<string | null>(null)

  async function handleRefund(bookingId: string) {
    if (!confirm('Request a full refund for this booking?')) return
    setRefundingId(bookingId)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/refund`, { method: 'POST' })
      if (res.ok) {
        const update = (list: Booking[]) =>
          list.map((b) => (b._id === bookingId ? { ...b, paymentStatus: 'refunded' as const } : b))
        setAsOwner(update)
        setToast({ msg: '↩ Refund requested — funds will return within 5–10 business days.', ok: true })
        setTimeout(() => setToast(null), 6000)
      } else {
        const data = await res.json()
        setToast({ msg: data.error || 'Refund failed.', ok: false })
        setTimeout(() => setToast(null), 5000)
      }
    } finally {
      setRefundingId(null)
    }
  }

  async function handlePay(bookingId: string) {
    setPayingId(bookingId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setPayingId(null)
    }
  }

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then(({ asOwner, asSitter }) => {
        setAsOwner(asOwner)
        setAsSitter(asSitter)
        if (asOwner.length === 0 && asSitter.length > 0) setTab('sitter')
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setToast({ msg: data.error || 'Failed to update booking.', ok: false })
      setTimeout(() => setToast(null), 5000)
      return
    }
    const refresh = (list: Booking[]) =>
      list.map((b) => (b._id === id ? { ...b, status } : b))
    setAsOwner(refresh)
    setAsSitter(refresh)
  }

  const list = tab === 'owner' ? asOwner : asSitter

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoHref="/dashboard">
        <BackLink href="/dashboard">Dashboard</BackLink>
      </Navbar>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <Suspense fallback={null}>
          <PaymentToast onToast={setToast} />
        </Suspense>
        {toast && (
          <div
            className={`mb-6 rounded-2xl px-5 py-4 text-sm font-medium ${toast.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {toast.msg}
          </div>
        )}
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Bookings</h1>

        <div className="mb-8 flex gap-2">
          {(['owner', 'sitter'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all border ${tab === t ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground'}`}
            >
              {t === 'owner' ? 'As Owner' : 'As Sitter'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : list.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-violet-50 border border-border border-dashed">
            <PawPrint size={36} className="shrink-0 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">
              No bookings yet
            </p>
            {tab === 'owner' && (
              <Link
                href="/sitters"
                className="mt-4 inline-block rounded-xl px-5 py-2 text-sm font-semibold text-white bg-primary"
              >
                Find a Sitter
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((booking) => {
              const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending
              const other = tab === 'owner' ? booking.sitterId : booking.ownerId
              const startD = new Date(booking.startDate)
              const endD = new Date(booking.endDate)
              const dateOpts = { month: 'short', day: 'numeric', year: 'numeric' } as const
              const timeOpts = { hour: 'numeric', minute: '2-digit' } as const
              const sameDay = startD.toDateString() === endD.toDateString()
              const rangeLabel = sameDay
                ? `${startD.toLocaleDateString(undefined, dateOpts)} · ${startD.toLocaleTimeString([], timeOpts)} – ${endD.toLocaleTimeString([], timeOpts)}`
                : `${startD.toLocaleDateString(undefined, dateOpts)}, ${startD.toLocaleTimeString([], timeOpts)} → ${endD.toLocaleDateString(undefined, dateOpts)}, ${endD.toLocaleTimeString([], timeOpts)}`

              return (
                <div
                  key={booking._id}
                  className="rounded-3xl p-6 shadow-sm bg-white border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {serviceLabel(booking.service)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {booking.petId?.name} · {rangeLabel}
                      </p>
                      {other && (
                        <p className="mt-0.5 text-xs text-muted">
                          {tab === 'owner' ? 'Sitter' : 'Owner'}: {other.firstName} {other.lastName}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="mt-1 text-xs italic text-muted">
                          &ldquo;{booking.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                      <p className="mt-2 text-sm font-bold text-foreground">
                        ${booking.totalPrice}
                      </p>
                      {booking.paymentStatus === 'paid' && (
                        <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          ✓ Paid
                        </span>
                      )}
                      {booking.paymentStatus === 'unpaid' && booking.status === 'accepted' && (
                        <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                          Awaiting payment
                        </span>
                      )}
                      {booking.paymentStatus === 'refunded' && (
                        <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-500">
                          ↩ Refunded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setChat({ bookingId: booking._id, otherName: other ? `${other.firstName} ${other.lastName}` : 'them' })}
                      className="rounded-xl px-4 py-1.5 text-xs font-semibold bg-gray-100 text-foreground border border-border"
                    >
                      Message
                    </button>
                    {tab === 'sitter' && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking._id, 'accepted')}
                          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, 'declined')}
                          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white bg-red-600"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {tab === 'sitter' && booking.status === 'accepted' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'active')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white bg-blue-600"
                      >
                        Mark Active
                      </button>
                    )}
                    {tab === 'sitter' && booking.status === 'active' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'completed')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white bg-gray-500"
                      >
                        Mark Completed
                      </button>
                    )}
                    {tab === 'owner' && booking.status === 'accepted' && booking.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePay(booking._id)}
                        disabled={payingId === booking._id}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60 bg-green-600"
                      >
                        {payingId === booking._id ? 'Redirecting…' : 'Pay Now'}
                      </button>
                    )}
                    {tab === 'owner' && booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold bg-red-100 text-red-800"
                      >
                        Cancel
                      </button>
                    )}
                    {tab === 'owner' && booking.status === 'completed' && !booking.reviewed && (
                      <button
                        onClick={() => setReview({ bookingId: booking._id, sitterName: booking.sitterId ? `${booking.sitterId.firstName} ${booking.sitterId.lastName}` : 'Sitter' })}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white bg-amber-500"
                      >
                        Leave Review
                      </button>
                    )}
                    {tab === 'owner' && booking.status === 'completed' && booking.reviewed && (
                      <span className="rounded-xl px-4 py-1.5 text-xs font-semibold bg-gray-100 text-gray-500">
                        ✓ Reviewed
                      </span>
                    )}
                    {tab === 'owner' && booking.status === 'cancelled' && booking.paymentStatus === 'paid' && (
                      <button
                        onClick={() => handleRefund(booking._id)}
                        disabled={refundingId === booking._id}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold disabled:opacity-60 bg-red-100 text-red-800"
                      >
                        {refundingId === booking._id ? 'Processing…' : '↩ Request Refund'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {chat && (
        <ChatDrawer
          bookingId={chat.bookingId}
          otherName={chat.otherName}
          onClose={() => setChat(null)}
        />
      )}
      {review && (
        <ReviewModal
          bookingId={review.bookingId}
          sitterName={review.sitterName}
          onClose={() => setReview(null)}
          onSubmitted={(id) => {
            const markReviewed = (list: Booking[]) =>
              list.map((b) => (b._id === id ? { ...b, reviewed: true } : b))
            setAsOwner(markReviewed)
          }}
        />
      )}
    </div>
  )
}
