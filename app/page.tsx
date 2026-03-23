import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()
  const isSignedIn = !!userId

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          background: "rgba(250,245,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            Kiki Paws
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a
            href="#services"
            style={{ color: "var(--muted)" }}
            className="transition-colors hover:text-violet-600"
          >
            Services
          </a>
          <a
            href="#how-it-works"
            style={{ color: "var(--muted)" }}
            className="transition-colors hover:text-violet-600"
          >
            How It Works
          </a>
          {isSignedIn ? (
            <>
              <a
                href="/dashboard"
                style={{ color: 'var(--muted)' }}
                className="transition-colors hover:text-violet-600"
              >
                Dashboard
              </a>
              <UserButton />
            </>
          ) : (
            <>
              <a
                href="/login"
                style={{ color: 'var(--muted)' }}
                className="transition-colors hover:text-violet-600"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--primary)' }}
              >
                Get Started
              </a>
            </>
          )}
        </div>
        {/* Mobile menu button placeholder */}
        <button
          className="flex flex-col gap-1 md:hidden"
          aria-label="Open menu"
        >
          <span
            className="block h-0.5 w-5 rounded"
            style={{ background: "var(--foreground)" }}
          />
          <span
            className="block h-0.5 w-5 rounded"
            style={{ background: "var(--foreground)" }}
          />
          <span
            className="block h-0.5 w-5 rounded"
            style={{ background: "var(--foreground)" }}
          />
        </button>
      </nav>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 60%, #ede9fe 100%)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 md:flex-row md:gap-8 md:px-12 md:py-24">

          {/* Left — text */}
          <div className="flex-1 text-center md:text-left">
            <span
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: "var(--primary-light)", color: "#4c1d95" }}
            >
              🐶 Trusted by pet families everywhere
            </span>

            <h1
              className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl"
              style={{ color: "var(--foreground)" }}
            >
              Loving care for your pets,{" "}
              <span style={{ color: "var(--primary)" }}>every single day</span>
            </h1>

            <p
              className="mb-10 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Kiki Paws connects you with caring, verified pet sitters in your
              neighborhood. Your furry family deserves the best — even when
              you&apos;re away.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
              <a
                href={isSignedIn ? "/sitters" : "/signup"}
                className="w-full rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:opacity-90 sm:w-auto"
                style={{ background: "var(--primary)" }}
              >
                Find a Sitter
              </a>
              <a
                href="/signup"
                className="w-full rounded-full border px-8 py-3.5 text-base font-semibold transition-all hover:bg-violet-50 sm:w-auto"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                Become a Sitter
              </a>
            </div>

            {/* Trust badges */}
            <div
              className="mt-10 flex flex-wrap justify-center gap-5 text-sm md:justify-start"
              style={{ color: "var(--muted)" }}
            >
              <span className="flex items-center gap-1.5"><span>✅</span> Verified sitters</span>
              <span className="flex items-center gap-1.5"><span>🔒</span> Secure payments</span>
              <span className="flex items-center gap-1.5"><span>⭐</span> 5-star care</span>
              <span className="flex items-center gap-1.5"><span>💬</span> Real-time updates</span>
            </div>
          </div>

          {/* Right — photo collage */}
          <div className="relative flex-1 w-full max-w-lg md:max-w-none" style={{ minHeight: '460px' }}>
            {/* Main image */}
            <img
              src="/photos/Hero.jpeg"
              alt="Happy pet with sitter"
              className="w-full rounded-3xl object-cover shadow-2xl"
              style={{ maxHeight: '520px' }}
            />
            {/* Floating card — bottom left */}
            <div
              className="animate-float absolute -bottom-6 -left-5 w-44 overflow-hidden rounded-2xl shadow-2xl"
              style={{ border: '4px solid white' }}
            >
              <img
                src="/photos/petsitter2.jpeg"
                alt="Pet sitter with dog"
                className="h-32 w-full object-cover"
              />
              <div className="px-3 py-2" style={{ background: '#ffffff' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Bella & Max</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>⭐⭐⭐⭐⭐ Loved it!</p>
              </div>
            </div>
            {/* Floating card — top right */}
            <div
              className="animate-float2 absolute -right-5 -top-5 w-40 overflow-hidden rounded-2xl shadow-2xl"
              style={{ border: '4px solid white' }}
            >
              <img
                src="/photos/petsitter3.jpeg"
                alt="Sitter caring for pet"
                className="h-28 w-full object-cover"
              />
              <div className="px-3 py-2" style={{ background: '#ffffff' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>Sarah</p>
                <p className="text-xs" style={{ color: 'var(--primary)' }}>✓ Verified sitter</p>
              </div>
            </div>
            {/* Happy pets badge */}
            <div
              className="absolute bottom-6 right-4 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <span className="text-lg">🐾</span>
              <div>
                <p className="text-xs font-bold leading-none">2,400+</p>
                <p className="text-xs leading-none opacity-80">happy pets</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-3 text-3xl font-bold md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Everything your pet needs
            </h2>
            <p className="text-base" style={{ color: "var(--muted)" }}>
              From drop-in visits to overnight stays — we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "🏡",
                title: "Pet Sitting",
                desc: "A trusted sitter comes to your home so your pet stays comfortable in their own space.",
              },
              {
                emoji: "🦮",
                title: "Dog Walking",
                desc: "Daily walks to keep your pup happy, healthy, and well-exercised while you're busy.",
              },
              {
                emoji: "🛏️",
                title: "Overnight Boarding",
                desc: "Your pet stays at a sitter's home and gets round-the-clock love and attention.",
              },
              {
                emoji: "🐱",
                title: "Cat Drop-In",
                desc: "Quick check-in visits to feed, play with, and care for your cat on their own terms.",
              },
              {
                emoji: "💊",
                title: "Pet Care & Meds",
                desc: "Sitters experienced with special needs pets, including medication administration.",
              },
              {
                emoji: "📸",
                title: "Photo Updates",
                desc: "Get real-time photos and updates from your sitter so you always know your pet is happy.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: "#f5f3ff" }}
                >
                  {service.emoji}
                </div>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sitters in Action */}
      <section className="px-6 pb-4 pt-4 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl shadow-xl" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)' }}>
            <div className="flex flex-col md:flex-row">
              {/* Left image */}
              <div className="relative md:w-1/2">
                <img
                  src="/photos/petsitter2.jpeg"
                  alt="Sitter with pet"
                  className="h-72 w-full object-cover md:h-full"
                  style={{ minHeight: '300px' }}
                />
                <div
                  className="absolute bottom-4 left-4 rounded-2xl px-4 py-2 shadow-md"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>🏡 In-home sitting</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Your pet, their comfort zone</p>
                </div>
              </div>
              {/* Right image */}
              <div className="relative md:w-1/2">
                <img
                  src="/photos/petsitter3.jpeg"
                  alt="Happy pet and sitter"
                  className="h-72 w-full object-cover md:h-full"
                  style={{ minHeight: '300px' }}
                />
                <div
                  className="absolute bottom-4 right-4 rounded-2xl px-4 py-2 shadow-md"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>🦮 Daily walks</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Exercise & adventure</p>
                </div>
              </div>
            </div>
            {/* Caption bar */}
            <div className="px-8 py-5 text-center">
              <p className="text-lg font-semibold text-white">
                Real sitters. Real love. Real results.
              </p>
              <p className="mt-1 text-sm text-violet-200">
                Every sitter is background-checked and pet-care trained.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="px-6 py-20 md:px-12"
        style={{ background: "#f5f3ff" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-3 text-3xl font-bold md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              How Kiki Paws works
            </h2>
            <p className="text-base" style={{ color: "var(--muted)" }}>
              Finding trusted care for your pet has never been easier.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                emoji: "🔍",
                title: "Search nearby sitters",
                desc: "Browse verified sitters in your area. Filter by service, availability, and reviews.",
              },
              {
                step: "2",
                emoji: "💬",
                title: "Connect & book",
                desc: "Chat directly with your chosen sitter, confirm details, and book securely in-app.",
              },
              {
                step: "3",
                emoji: "🐾",
                title: "Relax & enjoy updates",
                desc: "Sit back while your sitter sends photo updates. Your pet is in great hands.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm"
                  style={{ background: "var(--primary-light)" }}
                >
                  {item.emoji}
                </div>
                <span
                  className="absolute left-1/2 top-0 -ml-6 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--primary)", marginLeft: "16px" }}
                >
                  {item.step}
                </span>
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 md:px-12">
        <div
          className="mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)",
          }}
        >
          <span className="mb-4 block text-5xl">🐾</span>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to find your pet&apos;s perfect sitter?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-violet-100">
            Join thousands of happy pet owners who trust Kiki Paws for reliable,
            loving pet care.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={isSignedIn ? "/sitters" : "/signup"}
              className="w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold transition-all hover:bg-violet-50 sm:w-auto"
              style={{ color: "var(--primary)" }}
            >
              Find a Sitter Now
            </a>
            <a
              href="/signup"
              className="w-full rounded-full border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              List as a Sitter
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-10 md:px-12"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span
              className="text-lg font-bold"
              style={{ color: "var(--primary)" }}
            >
              Kiki Paws
            </span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kiki Paws. Made with ❤️ for pets
            everywhere.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="transition-colors hover:text-violet-600">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-violet-600">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-violet-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
