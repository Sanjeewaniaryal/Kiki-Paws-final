import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/actions/syncUser'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const user = await syncUser()

  if (user.onboarded) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-linear-135 from-violet-50 via-background to-violet-100">
      <OnboardingForm firstName={user.firstName} />
    </div>
  )
}
