import { UserButton } from '@clerk/nextjs'
import { syncUser } from '@/lib/actions/syncUser'
import { redirect } from 'next/navigation'
import UnreadBadge from '@/components/UnreadBadge'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Avatar from '@/components/Avatar'
import { CalendarDays, Dog, PawPrint, Search, Wallet } from 'lucide-react'

export default async function DashboardPage() {
  const user = await syncUser()

  if (!user.onboarded) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <UserButton />
      </Navbar>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s your Kiki Paws overview.
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-sm bg-white border border-border">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Your Profile
          </h2>

          <div className="flex items-center gap-6">
            <Avatar src={user.photo} alt="Profile" size={64} />
            <div>
              <p className="text-lg font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted">
                {user.email}
              </p>
              <span className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium capitalize bg-violet-50 text-primary">
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/dashboard/profile"
              className="inline-block rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 bg-primary"
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl p-4 bg-background border border-border">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Phone
              </p>
              <p className="mt-1 text-sm text-foreground">
                {user.phone || 'Not set'}
              </p>
            </div>
            <div className="rounded-2xl p-4 bg-background border border-border">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Location
              </p>
              <p className="mt-1 text-sm text-foreground">
                {user.location || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        <div className={`mt-6 grid grid-cols-1 gap-4 ${user.role === 'sitter' || user.role === 'both' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
          <Link
            href="/dashboard/pets"
            className="flex items-center gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80 bg-white border border-border"
          >
            <Dog size={28} className="shrink-0 text-primary" aria-hidden />
            <div>
              <p className="font-semibold text-foreground">My Pets</p>
              <p className="text-xs text-muted">Add and manage your pets</p>
            </div>
          </Link>
          <Link
            href="/sitters"
            className="flex items-center gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80 bg-white border border-border"
          >
            <Search size={28} className="shrink-0 text-primary" aria-hidden />
            <div>
              <p className="font-semibold text-foreground">Find a Sitter</p>
              <p className="text-xs text-muted">Browse trusted pet sitters</p>
            </div>
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80 bg-white border border-border"
          >
            <CalendarDays size={28} className="shrink-0 text-primary" aria-hidden />
            <div>
              <div className="flex items-center">
                <p className="font-semibold text-foreground">My Bookings</p>
                <UnreadBadge />
              </div>
              <p className="text-xs text-muted">View and manage bookings</p>
            </div>
          </Link>
          {(user.role === 'sitter' || user.role === 'both') && (
            <Link
              href="/dashboard/sitter-profile"
              className="flex items-center gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80 bg-white border border-border"
            >
              <PawPrint size={28} className="shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">Sitter Profile</p>
                <p className="text-xs text-muted">Services & availability</p>
              </div>
            </Link>
          )}
          {(user.role === 'sitter' || user.role === 'both') && (
            <Link
              href="/dashboard/earnings"
              className="flex items-center gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80 bg-white border border-border"
            >
              <Wallet size={28} className="shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">Earnings</p>
                <p className="text-xs text-muted">Revenue & history</p>
              </div>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
