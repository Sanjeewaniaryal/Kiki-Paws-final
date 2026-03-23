'use client'

import { useEffect, useState } from 'react'
import BookingModal from './BookingModal'

const SERVICES = [
  { key: '', label: 'All' },
  { key: 'sitting', label: '🏡 Pet Sitting' },
  { key: 'walking', label: '🦮 Dog Walking' },
  { key: 'boarding', label: '🛏️ Boarding' },
  { key: 'dropin', label: '🐱 Drop-In' },
  { key: 'grooming', label: '✂️ Grooming' },
]

const SERVICE_LABELS: Record<string, string> = {
  sitting: '🏡 Pet Sitting',
  walking: '🦮 Dog Walking',
  boarding: '🛏️ Boarding',
  dropin: '🐱 Drop-In',
  grooming: '✂️ Grooming',
}

interface Sitter {
  _id: string
  bio: string
  services: string[]
  hourlyRate: number
  location: string
  experience: string
  userId: {
    firstName: string
    lastName: string
    photo: string
    location: string
  }
}

export default function SittersPage() {
  const [sitters, setSitters] = useState<Sitter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('')
  const [bookingSitter, setBookingSitter] = useState<Sitter | null>(null)

  useEffect(() => {
    setLoading(true)
    const url = activeFilter ? `/api/sitters?service=${activeFilter}` : '/api/sitters'
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setSitters(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeFilter])

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(250,245,255,0.95)' }}
      >
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Kiki Paws</span>
        </a>
        <a href="/dashboard" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
          Dashboard
        </a>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Find a Sitter</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Browse trusted pet sitters in your area.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveFilter(s.key)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              style={{
                background: activeFilter === s.key ? 'var(--primary)' : '#ffffff',
                color: activeFilter === s.key ? '#fff' : 'var(--foreground)',
                border: `1px solid ${activeFilter === s.key ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sitter cards */}
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading sitters...</p>
        ) : sitters.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: '#f5f3ff', border: '1px dashed var(--border)' }}
          >
            <span className="text-4xl">🐾</span>
            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              No sitters found
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
              Try a different filter or check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sitters.map((sitter) => (
              <div
                key={sitter._id}
                className="rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-md"
                style={{ background: '#ffffff', border: '1px solid var(--border)' }}
              >
                {/* Sitter header */}
                <div className="flex items-center gap-4">
                  {sitter.userId.photo ? (
                    <img
                      src={sitter.userId.photo}
                      alt={sitter.userId.firstName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                      style={{ background: '#f5f3ff' }}
                    >
                      🐾
                    </div>
                  )}
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {sitter.userId.firstName} {sitter.userId.lastName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      📍 {sitter.location || sitter.userId.location || 'Location not set'}
                    </p>
                    {sitter.experience && (
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {sitter.experience} experience
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {sitter.bio && (
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    {sitter.bio}
                  </p>
                )}

                {/* Services */}
                {sitter.services.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sitter.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ background: '#f5f3ff', color: 'var(--primary)' }}
                      >
                        {SERVICE_LABELS[s] || s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rate + CTA */}
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {sitter.hourlyRate > 0 ? `$${sitter.hourlyRate}/hr` : 'Rate not set'}
                  </p>
                  <button
                    onClick={() => setBookingSitter(sitter)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {bookingSitter && (
        <BookingModal sitter={bookingSitter} onClose={() => setBookingSitter(null)} />
      )}
    </div>
  )
}
