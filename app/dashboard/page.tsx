import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,251,240,0.95)",
        }}
      >
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>
            Kiki Paws
          </span>
        </a>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16 md:px-12">
        <div
          className="rounded-3xl p-8 shadow-sm"
          style={{ background: "#ffffff", border: "1px solid var(--border)" }}
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="text-5xl">🐾</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
              </h1>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Your Kiki Paws dashboard is coming soon.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 text-sm"
            style={{ background: "#fff7ed", color: "var(--muted)" }}
          >
            🚧 We&apos;re building your dashboard. Check back soon for bookings, messages, and more.
          </div>
        </div>
      </main>
    </div>
  );
}
