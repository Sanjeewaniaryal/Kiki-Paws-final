'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import heroPhoto from '@/public/photos/Hero.jpeg'
import sitterPhoto2 from '@/public/photos/petsitter2.jpeg'
import sitterPhoto3 from '@/public/photos/petsitter3.jpeg'
import { Bed, CalendarDays, Cat, CreditCard, Dog, House, MessageCircle, PawPrint, Scissors, Search } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const services = [
  { icon: House, title: 'Pet Sitting', desc: "A trusted sitter comes to your home so your pet stays comfortable in their own space." },
  { icon: Dog, title: 'Dog Walking', desc: "Daily walks to keep your pup happy, healthy, and well-exercised while you're busy." },
  { icon: Bed, title: 'Overnight Boarding', desc: "Your pet stays at a sitter's home and gets round-the-clock love and attention." },
  { icon: Cat, title: 'Drop-In Visits', desc: "Quick check-ins to feed, play with, and look after pets that prefer to stay home." },
  { icon: Scissors, title: 'Grooming', desc: "Baths, brushing, and nail trims from sitters who offer grooming." },
  { icon: MessageCircle, title: 'In-App Messaging', desc: "Message your sitter from the booking to share routines, feeding times, and vet details." },
]

const steps = [
  { step: '1', icon: Search, title: 'Search nearby sitters', desc: 'Browse sitters in your area. Filter by service and read reviews from past bookings.' },
  { step: '2', icon: CalendarDays, title: 'Request a booking', desc: 'Pick your pet, the service, and the dates. The sitter accepts or declines.' },
  { step: '3', icon: CreditCard, title: 'Pay and stay in touch', desc: 'Pay securely through Stripe once accepted, and message your sitter throughout the booking.' },
]

export default function HomeClient({ isSignedIn }: { isSignedIn: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">

      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/92 backdrop-blur-md border-b border-border"
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <PawPrint size={28} className="shrink-0 text-primary" aria-hidden />
          <span className="text-xl font-bold tracking-tight text-primary">Kiki Paws</span>
        </motion.div>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {['#services', '#how-it-works'].map((href, i) => (
            <motion.a
              key={href}
              href={href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="relative transition-colors hover:text-violet-600 text-muted"
            >
              {href === '#services' ? 'Services' : 'How It Works'}
            </motion.a>
          ))}
          {isSignedIn ? (
            <>
              <motion.a
                href="/dashboard"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.29 }}
                className="transition-colors hover:text-violet-600 text-muted"
              >
                Dashboard
              </motion.a>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <UserButton />
              </motion.div>
            </>
          ) : (
            <>
              <motion.a
                href="/login"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.29 }}
                className="transition-colors hover:text-violet-600 text-muted"
              >
                Sign In
              </motion.a>
              <motion.a
                href="/signup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-full px-5 py-2 text-sm font-semibold text-white bg-primary"
              >
                Get Started
              </motion.a>
            </>
          )}
        </div>

        <button
          className="flex flex-col gap-1 md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }} className="block h-0.5 w-5 rounded bg-foreground" />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block h-0.5 w-5 rounded bg-foreground" />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }} className="block h-0.5 w-5 rounded bg-foreground" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-40 flex flex-col gap-1 px-6 py-4 md:hidden bg-background/98 backdrop-blur-md border-b border-border"
          >
            {[
              { href: '#services', label: 'Services' },
              { href: '#how-it-works', label: 'How It Works' },
              ...(isSignedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : [{ href: '/login', label: 'Sign In' }]),
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-violet-50 text-foreground"
              >
                {link.label}
              </a>
            ))}
            {!isSignedIn && (
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full px-4 py-3 text-center text-sm font-semibold text-white bg-primary"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative overflow-hidden bg-linear-135 from-violet-50 via-background via-60% to-violet-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 md:flex-row md:gap-8 md:px-12 md:py-24">

          <div className="flex-1 text-center md:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-primary-light text-violet-900"
            >
              Pet sitting, walking &amp; boarding near you
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl text-foreground"
            >
              Loving care for your pets,{' '}
              <motion.span className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                every single day
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
              className="mb-10 max-w-xl text-lg leading-relaxed text-muted"
            >
              Kiki Paws connects you with pet sitters in your neighborhood.
              Find someone you trust, book, pay, and chat, all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4 sm:flex-row md:items-start"
            >
              <motion.a
                href={isSignedIn ? '/sitters' : '/signup'}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-md sm:w-auto bg-primary"
              >
                Find a Sitter
              </motion.a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full border border-primary px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary-light sm:w-auto"
              >
                Become a Sitter
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-5 text-sm md:justify-start text-muted"
            >
              {['Secure Stripe payments', 'Real-time chat', 'Reviews from real bookings'].map((badge) => (
                <span key={badge} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative flex-1 w-full max-w-lg md:max-w-none min-h-[460px]"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={heroPhoto}
              alt="Happy pet with sitter"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full rounded-3xl object-cover shadow-2xl max-h-[520px]"
            />
            <motion.div
              className="animate-float absolute -bottom-6 -left-5 w-44 overflow-hidden rounded-2xl shadow-2xl border-4 border-white"
              initial={{ opacity: 0, scale: 0.7, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <Image src={sitterPhoto2} alt="Pet sitter with dog" sizes="176px" className="h-32 w-full object-cover" />
              <div className="px-3 py-2 bg-white">
                <p className="text-xs font-semibold text-foreground">Bella & Max</p>
                <p className="text-xs text-muted"><span className="text-amber-500">★★★★★</span> Loved it!</p>
              </div>
            </motion.div>
            <motion.div
              className="animate-float2 absolute -right-5 -top-5 w-40 overflow-hidden rounded-2xl shadow-2xl border-4 border-white"
              initial={{ opacity: 0, scale: 0.7, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <Image src={sitterPhoto3} alt="Sitter caring for pet" sizes="160px" className="h-28 w-full object-cover" />
              <div className="px-3 py-2 bg-white">
                <p className="text-xs font-semibold text-foreground">Sarah</p>
                <p className="text-xs text-primary">Dog walker</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      <section id="services" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mb-3 text-3xl font-bold md:text-4xl text-foreground">
              Everything your pet needs
            </h2>
            <p className="text-base text-muted">
              From drop-in visits to overnight stays — we&apos;ve got you covered.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ staggerChildren: 0.1 }}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(124,58,237,0.12)' }}
                className="rounded-2xl p-6 bg-card-bg border border-border cursor-default"
              >
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-primary"
                  whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                >
                  <service.icon size={24} aria-hidden />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-4 pt-4 md:px-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="overflow-hidden rounded-3xl shadow-xl bg-linear-135 from-primary to-violet-500"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col md:flex-row">
              <motion.div
                className="relative md:w-1/2"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <Image
                  src={sitterPhoto2}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt="Sitter with pet"
                  className="h-72 w-full object-cover md:h-full min-h-[300px]"
                />
                <div className="absolute bottom-4 left-4 rounded-2xl px-4 py-2 shadow-md bg-white/95">
                  <p className="text-sm font-bold text-foreground">In-home sitting</p>
                  <p className="text-xs text-muted">Your pet, their comfort zone</p>
                </div>
              </motion.div>
              <motion.div
                className="relative md:w-1/2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <Image
                  src={sitterPhoto3}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt="Happy pet and sitter"
                  className="h-72 w-full object-cover md:h-full min-h-[300px]"
                />
                <div className="absolute bottom-4 right-4 rounded-2xl px-4 py-2 shadow-md bg-white/95">
                  <p className="text-sm font-bold text-foreground">Daily walks</p>
                  <p className="text-xs text-muted">Exercise & adventure</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="px-8 py-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg font-semibold text-white">Real sitters. Real love. Real results.</p>
              <p className="mt-1 text-sm text-violet-200">Every sitter is background-checked and pet-care trained.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20 md:px-12 bg-violet-50">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="mb-3 text-3xl font-bold md:text-4xl text-foreground">
              How Kiki Paws works
            </h2>
            <p className="text-base text-muted">
              Finding trusted care for your pet has never been easier.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary shadow-sm"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <item.icon size={28} aria-hidden />
                </motion.div>
                <span className="absolute left-1/2 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white bg-primary ml-4">
                  {item.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center shadow-sm bg-linear-135 from-primary to-violet-500"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="mb-4 inline-block text-white"
            animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
          >
            <PawPrint size={48} aria-hidden />
          </motion.span>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to find your pet&apos;s perfect sitter?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-violet-100">
            Create an account in a minute and start browsing sitters near you.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href={isSignedIn ? '/sitters' : '/signup'}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold sm:w-auto text-primary"
            >
              Find a Sitter Now
            </motion.a>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-full border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
            >
              List as a Sitter
            </motion.a>
          </div>
        </motion.div>
      </section>

      <motion.footer
        className="px-6 py-10 md:px-12 border-t border-border text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <PawPrint size={24} className="shrink-0 text-primary" aria-hidden />
            <span className="text-lg font-bold text-primary">Kiki Paws</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kiki Paws.
          </p>
          <div className="flex gap-6 text-sm">
            {[{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Contact', href: 'mailto:support@kikipaws.com' }].map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.footer>

    </div>
  )
}
