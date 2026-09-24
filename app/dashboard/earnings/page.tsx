'use client'

import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Wallet } from 'lucide-react'

interface EarningBooking {
  _id: string
  service: string
  totalPrice: number
  startDate: string
  endDate: string
  createdAt: string
  ownerId: { firstName: string; lastName: string }
  petId: { name: string }
}

interface EarningsData {
  total: number
  byMonth: Record<string, number>
  bookings: EarningBooking[]
}

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    fetch('/api/sitter-profile/earnings')
      .then((r) => { if (r.status === 401 || r.status === 403) { setForbidden(true); return null } return r.json() })
      .then((d) => { if (d) { setData(d); setLoading(false) } })
  }, [])

  if (forbidden) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Not available</p>
          <Link href="/dashboard" className="mt-2 inline-block text-sm text-primary">← Dashboard</Link>
        </div>
      </div>
    )
  }

  const months = data ? Object.entries(data.byMonth) : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoHref="/dashboard">
        <UserButton />
      </Navbar>

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted">
            ← Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
          <p className="mt-1 text-sm text-muted">All completed paid bookings.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl p-6 bg-violet-50 h-[80px]" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl p-5 bg-white border border-border">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Total Earned</p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  ${data?.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-2xl p-5 bg-white border border-border">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Paid Bookings</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{data?.bookings.length}</p>
              </div>
              <div className="rounded-2xl p-5 bg-white border border-border">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Avg per Booking</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {data && data.bookings.length > 0
                    ? `$${(data.total / data.bookings.length).toFixed(2)}`
                    : '—'}
                </p>
              </div>
            </div>

            {months.length > 0 && (
              <div className="mb-8 rounded-3xl p-6 shadow-sm bg-white border border-border">
                <h2 className="mb-4 text-base font-semibold text-foreground">Monthly Breakdown</h2>
                <div className="space-y-3">
                  {months.map(([month, amount]) => (
                    <div key={month} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-gray-50 border border-border">
                      <span className="text-sm font-medium text-foreground">{month}</span>
                      <span className="text-sm font-semibold text-primary">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl shadow-sm bg-white border border-border">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-base font-semibold text-foreground">Transaction History</h2>
              </div>

              {data?.bookings.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Wallet size={28} className="shrink-0 text-primary" aria-hidden />
                  <p className="mt-2 text-sm text-muted">No paid bookings yet.</p>
                </div>
              ) : (
                <div className="divide-y border-border">
                  {data?.bookings.map((b) => {
                    const startD = new Date(b.startDate)
                    const endD = new Date(b.endDate)
                    const dateOpts = { month: 'short', day: 'numeric' } as const
                    const timeOpts = { hour: 'numeric', minute: '2-digit' } as const
                    const sameDay = startD.toDateString() === endD.toDateString()
                    const rangeLabel = sameDay
                      ? `${startD.toLocaleDateString(undefined, dateOpts)} ${startD.toLocaleTimeString([], timeOpts)} – ${endD.toLocaleTimeString([], timeOpts)}`
                      : `${startD.toLocaleDateString(undefined, dateOpts)}, ${startD.toLocaleTimeString([], timeOpts)} → ${endD.toLocaleDateString(undefined, dateOpts)}, ${endD.toLocaleTimeString([], timeOpts)}`
                    return (
                      <div key={b._id} className="flex items-center justify-between px-6 py-4">
                        <div>
                          <p className="text-sm font-medium capitalize text-foreground">
                            {b.service} — {b.petId?.name}
                          </p>
                          <p className="text-xs text-muted">
                            {b.ownerId?.firstName} {b.ownerId?.lastName} · {rangeLabel}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-green-800">+${b.totalPrice.toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
