'use client'

import { useEffect, useState } from 'react'
import Navbar, { BackLink } from '@/components/Navbar'
import Link from 'next/link'
import { BOOKING_STATUS } from '@/lib/constants'
import { Ban, CalendarDays, House, Star, Users, Wallet } from 'lucide-react'

interface Stats { totalUsers: number; totalSitters: number; totalBookings: number; totalRevenue: number; reviewCount: number }
interface Booking {
  _id: string; service: string; status: string; totalPrice: number; createdAt: string
  ownerId: { firstName: string; lastName: string; email: string }
  sitterId: { firstName: string; lastName: string }
  petId: { name: string }
}
interface User { _id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string; onboarded: boolean }

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [tab, setTab] = useState<'overview' | 'bookings' | 'users'>('overview')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => { if (r.status === 403) { setForbidden(true); return null } return r.json() })
      .then((data) => {
        if (!data) return
        setStats(data.stats)
        setBookings(data.recentBookings)
        setUsers(data.recentUsers)
        setLoading(false)
      })
  }, [])

  if (forbidden) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Ban size={44} className="shrink-0 text-red-600" aria-hidden />
          <p className="mt-4 text-lg font-semibold text-foreground">Access Denied</p>
          <p className="mt-2 text-sm text-muted">You are not authorised to view this page.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary">← Dashboard</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted">Loading admin panel…</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar badge="Admin">
        <BackLink href="/dashboard">Dashboard</BackLink>
      </Navbar>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12">
        <h1 className="mb-8 text-2xl font-bold text-foreground">Admin Panel</h1>

        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users },
              { label: 'Sitters', value: stats.totalSitters, icon: House },
              { label: 'Bookings', value: stats.totalBookings, icon: CalendarDays },
              { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: Wallet },
              { label: 'Reviews', value: stats.reviewCount, icon: Star },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5 bg-white border border-border">
                <s.icon size={22} className="text-primary" aria-hidden />
                <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 flex gap-2">
          {(['overview', 'bookings', 'users'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all border ${tab === t ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        {(tab === 'overview' || tab === 'bookings') && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Bookings</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Owner', 'Sitter', 'Pet', 'Service', 'Total', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-t border-border odd:bg-white even:bg-neutral-50">
                      <td className="px-4 py-3 text-foreground">{b.ownerId?.firstName} {b.ownerId?.lastName}</td>
                      <td className="px-4 py-3 text-foreground">{b.sitterId?.firstName} {b.sitterId?.lastName}</td>
                      <td className="px-4 py-3 text-muted">{b.petId?.name}</td>
                      <td className="px-4 py-3 capitalize text-muted">{b.service}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">${b.totalPrice}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BOOKING_STATUS[b.status]?.className ?? ''}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(tab === 'overview' || tab === 'users') && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Users</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Name', 'Email', 'Role', 'Onboarded', 'Joined'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-border odd:bg-white even:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-foreground">{u.firstName} {u.lastName}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize bg-violet-50 text-primary">{u.role}</span>
                      </td>
                      <td className={`px-4 py-3 text-xs ${u.onboarded ? 'text-green-800' : 'text-yellow-800'}`}>{u.onboarded ? '✓ Yes' : '✗ No'}</td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
