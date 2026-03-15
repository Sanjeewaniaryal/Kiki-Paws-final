import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/actions/syncUser'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const user = await syncUser()

  if (user.onboarded) redirect('/dashboard')

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #fffbf0 50%, #fef3c7 100%)',
      }}
    >
      <OnboardingForm firstName={user.firstName} />
    </div>
  )
}
