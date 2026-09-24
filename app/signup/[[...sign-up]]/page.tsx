import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-linear-135 from-violet-50 via-background to-violet-100">
      <div className="flex flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <PawPrint size={36} className="shrink-0 text-primary" aria-hidden />
          <span className="text-2xl font-bold text-primary">
            Kiki Paws
          </span>
        </Link>
        <SignUp />
      </div>
    </div>
  )
}
