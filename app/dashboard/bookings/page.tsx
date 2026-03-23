'use client'

import { useEffect, useState } from 'react'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  accepted:  { bg: '#dcfce7', color: '#166534', label: 'Accepted' },
  declined:  { bg: '#fee2e2', color: '#991b1b', label: 'Declined' },
  active:    { bg: '#dbeafe', color: '#1e40af', label: 'Active' },
  completed: { bg: '#f3f4f6', color: '#374151', label: 'Completed' },
  cancelled: { bg: '#f3f4f6', color: '#6b7280', label: 'Cancelled' },
}

const SERVICE_LABELS: Record<string, string> = {
  sitting: '🏡 Pet Sitting',
  walking: '🦮 Dog Walking',
  boarding: '🛏️ Boarding',
  dropin: '🐱 Drop-In',
  grooming: '✂️ Grooming',
}

interface Booking {
  _id: string
  service: string
  startDate: string
  endDate: string
  status: string
  totalPrice: number
  notes?: string
  petId: { name: string; breed: string }
  sitterId?: { firstName: string; lastName: string; photo: string }
  ownerId?: { firstName: string; lastName: string; photo: string }
}

export default function BookingsPage() {
  const [asOwner, setAsOwner] = useState<Booking[]>([])
  const [asSitter, setAsSitter] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'owner' | 'sitter'>('owner')

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
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const refresh = (list: Booking[]) =>
      list.map((b) => (b._id === id ? { ...b, status } : b))
    setAsOwner(refresh)
    setAsSitter(refresh)
  }

  const list = tab === 'owner' ? asOwner : asSitter

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(250,245,255,0.95)' }}
      >
        <a href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Kiki Paws</span>
        </a>
        <a href="/dashboard" className="text-sm" style={{ color: 'var(--muted)' }}>← Dashboard</a>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>My Bookings</h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          {(['owner', 'sitter'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'var(--primary)' : '#ffffff',
                color: tab === t ? '#fff' : 'var(--foreground)',
                border: `1px solid ${tab === t ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {t === 'owner' ? '🐶 As Owner' : '🏡 As Sitter'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</p>
        ) : list.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: '#f5f3ff', border: '1px dashed var(--border)' }}
          >
            <span className="text-4xl">🐾</span>
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              No bookings yet
            </p>
            {tab === 'owner' && (
              <a
                href="/sitters"
                className="mt-4 inline-block rounded-xl px-5 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Find a Sitter
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((booking) => {
              const style = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
              const other = tab === 'owner' ? booking.sitterId : booking.ownerId
              const start = new Date(booking.startDate).toLocaleDateString()
              const end = new Date(booking.endDate).toLocaleDateString()

              return (
                <div
                  key={booking._id}
                  className="rounded-3xl p-6 shadow-sm"
                  style={{ background: '#ffffff', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {SERVICE_LABELS[booking.service] || booking.service}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                        🐾 {booking.petId?.name} · {start} → {end}
                      </p>
                      {other && (
                        <p className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                          {tab === 'owner' ? 'Sitter' : 'Owner'}: {other.firstName} {other.lastName}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="mt-1 text-xs italic" style={{ color: 'var(--muted)' }}>
                          &ldquo;{booking.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {style.label}
                      </span>
                      <p className="mt-2 text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                        ${booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tab === 'sitter' && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking._id, 'accepted')}
                          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
                          style={{ background: '#16a34a' }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, 'declined')}
                          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
                          style={{ background: '#dc2626' }}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {tab === 'sitter' && booking.status === 'accepted' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'active')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
                        style={{ background: '#2563eb' }}
                      >
                        Mark Active
                      </button>
                    )}
                    {tab === 'sitter' && booking.status === 'active' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'completed')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
                        style={{ background: '#6b7280' }}
                      >
                        Mark Completed
                      </button>
                    )}
                    {tab === 'owner' && booking.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                        className="rounded-xl px-4 py-1.5 text-xs font-semibold"
                        style={{ background: '#fee2e2', color: '#991b1b' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
