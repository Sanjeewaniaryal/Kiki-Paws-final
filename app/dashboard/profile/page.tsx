import { syncUser } from '@/lib/actions/syncUser'
import { UserButton } from '@clerk/nextjs'
import ProfileForm from './ProfileForm'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Avatar from '@/components/Avatar'

export default async function ProfilePage() {
  const user = await syncUser()

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoHref="/dashboard">
        <UserButton />
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted"
          >
            ← Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-muted">
            Update your personal details.
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-sm bg-white border border-border">
          <div className="mb-8 flex items-center gap-4">
            <Avatar src={user.photo} alt="Profile" size={56} />
            <div>
              <p className="font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted">
                {user.email}
              </p>
            </div>
          </div>

          <ProfileForm
            initialData={{
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone || '',
              location: user.location || '',
              role: user.role,
            }}
          />
        </div>
      </main>
    </div>
  )
}
