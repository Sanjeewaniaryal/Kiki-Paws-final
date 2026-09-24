import Link from 'next/link'
import { PawPrint } from 'lucide-react'

type NavbarProps = {
  logoHref?: string
  badge?: string
  children?: React.ReactNode
}

export default function Navbar({ logoHref = '/', badge, children }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border bg-background/95">
      <div className="flex items-center gap-3">
        <Link href={logoHref} className="flex items-center gap-2">
          <PawPrint size={24} className="text-primary" aria-hidden />
          <span className="text-lg font-bold text-primary">Kiki Paws</span>
        </Link>
        {badge && (
          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white bg-primary">
            {badge}
          </span>
        )}
      </div>
      {children}
    </nav>
  )
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-muted">
      ← {children}
    </Link>
  )
}
