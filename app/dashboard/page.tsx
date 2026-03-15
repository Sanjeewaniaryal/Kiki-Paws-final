import { UserButton } from '@clerk/nextjs'
import { syncUser } from '@/lib/actions/syncUser'

export default async function DashboardPage() {
  const user = await syncUser()

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,251,240,0.95)',
        }}
      >
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
            Kiki Paws
          </span>
        </a>
        <UserButton />
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Here&apos;s your Kiki Paws overview.
          </p>
        </div>

        {/* Profile card */}
        <div
          className="rounded-3xl p-8 shadow-sm"
          style={{ background: '#ffffff', border: '1px solid var(--border)' }}
        >
          <h2 className="mb-6 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            Your Profile
          </h2>

          <div className="flex items-center gap-6">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                style={{ background: '#fff7ed' }}
              >
                🐾
              </div>
            )}
            <div>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {user.email}
              </p>
              <span
                className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium capitalize"
                style={{ background: '#fff7ed', color: 'var(--primary)' }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <a
              href="/dashboard/profile"
              className="inline-block rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--primary)' }}
            >
              Edit Profile
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className="rounded-2xl p-4"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                Phone
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--foreground)' }}>
                {user.phone || 'Not set'}
              </p>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                Location
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--foreground)' }}>
                {user.location || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div
          className="mt-6 rounded-2xl p-6 text-sm"
          style={{ background: '#fff7ed', color: 'var(--muted)' }}
        >
          🚧 Bookings, messaging, and more coming soon.
        </div>
      </main>
    </div>
  )
}
