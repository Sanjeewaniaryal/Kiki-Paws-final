'use client'

import { useEffect, useState } from 'react'
import BookingModal from './BookingModal'
import StarRating from '@/components/StarRating'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { SERVICES, serviceLabel } from '@/lib/constants'
import Avatar from '@/components/Avatar'
import { PawPrint } from 'lucide-react'

const FILTERS = [
  { key: '', label: 'All' },
  ...SERVICES.map((key) => ({ key, label: serviceLabel(key) })),
]

interface DayAvail { available: boolean; from: string; to: string }

interface Sitter {
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

const DAY_SHORT: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

interface SearchResult {
  query: string
  sitters: Sitter[]
  pages: number
  total: number
}

export default function SittersPage() {
  const [activeFilter, setActiveFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [bookingSitter, setBookingSitter] = useState<Sitter | null>(null)

  const params = new URLSearchParams({ page: String(page) })
  if (activeFilter) params.set('service', activeFilter)
  if (search) params.set('search', search)
  const query = params.toString()

  useEffect(() => {
    let cancelled = false
    fetch(`/api/sitters?${query}`)
      .then((res) => res.json())
      .catch(() => ({}))
      .then((data) => {
        if (cancelled) return
        setResult({
          query,
          sitters: Array.isArray(data.sitters) ? data.sitters : [],
          pages: data.pages || 1,
          total: data.total || 0,
        })
      })
    return () => { cancelled = true }
  }, [query])

  const loading = result?.query !== query
  const sitters = result?.sitters ?? []
  const pages = result?.pages ?? 1
  const total = result?.total ?? 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function handleFilter(key: string) {
    setActiveFilter(key)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <Link href="/dashboard" className="text-sm font-medium text-primary">Dashboard</Link>
      </Navbar>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Find a Sitter</h1>
          <p className="mt-1 text-sm text-muted">
            {total > 0 ? `${total} sitter${total !== 1 ? 's' : ''} available` : 'Browse trusted pet sitters in your area.'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or location…"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none border border-border bg-white text-foreground"
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-primary"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
              className="rounded-xl px-4 py-2.5 text-sm border border-border text-muted"
            >
              Clear
            </button>
          )}
        </form>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleFilter(s.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all border ${activeFilter === s.key ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl p-6 bg-violet-50 h-[220px]" />
            ))}
          </div>
        ) : sitters.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-violet-50 border border-border border-dashed">
            <PawPrint size={36} className="shrink-0 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No sitters found</p>
            <p className="mt-1 text-xs text-muted">Try a different search or filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {sitters.map((sitter) => (
                <div
                  key={sitter._id}
                  className="rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-md bg-white border border-border cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <Avatar src={sitter.profilePhoto || sitter.userId.photo} alt={sitter.userId.firstName} size={56} />
                    <div>
                      <a href={`/sitters/${sitter._id}`} className="font-semibold hover:underline text-foreground">
                        {sitter.userId.firstName} {sitter.userId.lastName}
                      </a>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <StarRating value={sitter.averageRating} size="sm" />
                        <span className="text-xs text-muted">
                          {sitter.averageRating > 0 ? `${sitter.averageRating.toFixed(1)} (${sitter.reviewCount})` : 'No reviews yet'}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {sitter.location || sitter.userId.location || 'Location not set'}
                      </p>
                      {sitter.experience && (
                        <p className="text-xs text-muted">{sitter.experience} experience</p>
                      )}
                    </div>
                  </div>

                  {sitter.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-foreground">{sitter.bio}</p>
                  )}

                  {sitter.services.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {sitter.services.map((s) => (
                        <span key={s} className="rounded-full px-2.5 py-1 text-xs font-medium bg-violet-50 text-primary">
                          {serviceLabel(s)}
                        </span>
                      ))}
                    </div>
                  )}

                  {sitter.availability && DAY_ORDER.some((d) => sitter.availability?.[d]?.available) && (
                    <div className="mt-4">
                      <p className="mb-1.5 text-xs font-medium text-muted">Available</p>
                      <div className="flex flex-wrap gap-1">
                        {DAY_ORDER.filter((d) => sitter.availability?.[d]?.available).map((d) => (
                          <span key={d} className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-green-800">
                            {DAY_SHORT[d]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {sitter.hourlyRate > 0 ? `$${sitter.hourlyRate}/hr` : 'Rate not set'}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/sitters/${sitter._id}`}
                        className="rounded-xl px-4 py-2 text-sm font-medium border border-border text-foreground"
                      >
                        View Profile
                      </a>
                      <button
                        onClick={() => setBookingSitter(sitter)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-primary"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-40 border border-border text-foreground"
                >
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-medium border ${p === page ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-40 border border-border text-foreground"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {bookingSitter && <BookingModal sitter={bookingSitter} onClose={() => setBookingSitter(null)} />}
    </div>
  )
}
