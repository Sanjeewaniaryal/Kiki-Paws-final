import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="mb-10 text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        {[
          { title: '1. Acceptance of Terms', body: 'By accessing or using Kiki Paws, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.' },
          { title: '2. Description of Service', body: 'Kiki Paws is an online platform that connects pet owners with independent pet sitters. We do not employ sitters directly; they are independent contractors. We facilitate the booking and payment process between owners and sitters.' },
          { title: '3. User Accounts', body: 'You must create an account to use Kiki Paws. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to use this service.' },
          { title: '4. Bookings & Payments', body: 'All bookings are subject to sitter acceptance. Payments are processed securely through Stripe. Kiki Paws collects a platform service fee on each transaction. Prices displayed are in USD.' },
          { title: '5. Cancellations & Refunds', body: 'Cancellation and refund policies vary. Owners may cancel pending bookings at no charge. Cancellations of accepted or paid bookings may be subject to fees. Refunds are processed on a case-by-case basis.' },
          { title: '6. User Conduct', body: 'You agree not to misuse the platform, provide false information, harass other users, or engage in fraudulent activity. We reserve the right to suspend or terminate accounts that violate these terms.' },
          { title: '7. Liability Limitation', body: 'Kiki Paws is not liable for any damages, injuries, or losses arising from pet care services provided by independent sitters. We strongly recommend that sitters and owners maintain appropriate insurance coverage.' },
          { title: '8. Changes to Terms', body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.' },
          { title: '9. Contact', body: 'For questions about these Terms, please contact us at support@kikipaws.com.' },
        ].map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-foreground">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </main>

      <footer className="px-6 py-8 text-center text-sm border-t border-border text-muted">
        <Link className="text-primary" href="/privacy">Privacy Policy</Link>
        {' · '}
        <Link className="text-primary" href="/">Back to Home</Link>
      </footer>
    </div>
  )
}
