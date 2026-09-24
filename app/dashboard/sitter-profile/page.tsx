import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import SitterProfile from '@/lib/models/SitterProfile'
import SitterProfileForm from './SitterProfileForm'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function SitterProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await connectDB()
  const user = await User.findOne({ clerkId: userId })
  if (!user || (user.role !== 'sitter' && user.role !== 'both')) redirect('/dashboard')

  const profile = await SitterProfile.findOne({ userId: user._id }).lean()

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoHref="/dashboard">
        <UserButton />
      </Navbar>

      <main className="mx-auto max-w-2xl px-6 py-12 md:px-12">
        <div className="mb-8">
          <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted">
            ← Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Sitter Profile</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your services, rates, and weekly availability.
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-sm bg-white border border-border">
          <SitterProfileForm
            initialProfile={
              profile
                ? {
                    bio: (profile as { bio?: string }).bio || '',
                    services: ((profile as { services?: string[] }).services || []),
                    hourlyRate: (profile as { hourlyRate?: number }).hourlyRate || 0,
                    experience: (profile as { experience?: string }).experience || '',
                    availability: (profile as { availability?: Record<string, { available: boolean; from: string; to: string }> }).availability ?? undefined,
                    profilePhoto: (profile as { profilePhoto?: string }).profilePhoto ?? undefined,
                  }
                : null
            }
          />
        </div>
      </main>
    </div>
  )
}
