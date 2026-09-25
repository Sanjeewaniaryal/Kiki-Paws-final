# Kiki Paws

A full-stack pet sitting marketplace that connects pet owners with trusted local sitters. Owners can browse sitters, book services, pay securely, and chat in real time. Sitters manage their availability, accept bookings, and track their earnings.

**Live app:** https://kikipaws-157616526370.europe-west1.run.app (hosted on Google Cloud Run, see [Deployment](#deployment))

> For architecture, the full API reference, data model schemas, and auth rules, see [DOCUMENTATION.md](./DOCUMENTATION.md).

---

## Features

### For Pet Owners
- Browse and search sitters by name, location, or service type
- View full sitter profiles with bio, services, availability, and reviews
- Book a sitter and pay securely via Stripe Checkout
- Real-time chat with your sitter via Server-Sent Events
- Leave a star rating and review after a completed booking
- Request a refund on cancelled paid bookings
- Manage your pets (add photos, breed, age, size, notes)

### For Sitters
- Set up a public profile with bio, services, hourly rate, and weekly availability
- Accept, decline, and manage incoming bookings
- Mark bookings as active and completed
- View earnings dashboard with monthly breakdown and transaction history
- Real-time chat with pet owners

### Platform
- Admin panel with stats (users, bookings, revenue, reviews) and management tables
- Email notifications for booking requests, status changes, and payment confirmation
- Unread message badge with 30-second polling
- Mobile-responsive UI with animated homepage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animations | Framer Motion |
| Authentication | Clerk v7 |
| Database | MongoDB + Mongoose |
| Payments | Stripe Checkout (sandbox) |
| File Uploads | UploadThing |
| Email | Resend |
| Real-time | Server-Sent Events (SSE) |
| Testing | Jest + React Testing Library |
| Containers | Docker + Docker Compose |
| Hosting | Google Cloud Run + Artifact Registry, MongoDB Atlas |

---

## Project Structure

```
kikipaws/
├── app/
│   ├── page.tsx                      # Homepage (server component)
│   ├── HomeClient.tsx                # Animated homepage client component
│   ├── admin/                        # Admin panel
│   ├── api/
│   │   ├── bookings/                 # Booking CRUD + status + refund
│   │   ├── checkout/                 # Stripe Checkout session creation
│   │   ├── messages/                 # Chat REST + SSE + unread count
│   │   ├── pets/                     # Pet CRUD
│   │   ├── reviews/                  # Review creation + fetch
│   │   ├── sitters/                  # Sitter browse + individual profile
│   │   ├── sitter-profile/           # Sitter settings + earnings
│   │   ├── uploadthing/              # File upload handler
│   │   ├── user/                     # User profile update
│   │   └── webhook/stripe/           # Stripe webhook handler
│   ├── dashboard/
│   │   ├── bookings/                 # Booking list, chat drawer, review modal
│   │   ├── earnings/                 # Sitter earnings view
│   │   ├── pets/                     # Pet management
│   │   ├── profile/                  # User profile settings
│   │   └── sitter-profile/           # Sitter-specific settings + availability
│   ├── onboarding/                   # Role selection + profile setup
│   ├── sitters/                      # Browse sitters + individual sitter page
│   ├── privacy/                      # Privacy policy
│   └── terms/                        # Terms of service
├── components/
│   ├── ImageUpload.tsx               # Reusable photo upload component
│   ├── Navbar.tsx                    # Shared page header
│   ├── StarRating.tsx                # Interactive/display star rating
│   └── UnreadBadge.tsx               # Unread message count badge
├── lib/
│   ├── constants.ts                  # Service + weekday labels
│   ├── db.ts                         # MongoDB connection
│   ├── email.ts                      # Resend email helpers
│   ├── reviews.ts                    # Review validation + average rating
│   ├── stripe.ts                     # Stripe client
│   ├── uploadthing.ts                # UploadThing file router
│   ├── actions/syncUser.ts           # Clerk → MongoDB user sync
│   └── models/                       # Mongoose models
│       ├── Booking.ts
│       ├── Message.ts
│       ├── Pet.ts
│       ├── Review.ts
│       ├── SitterProfile.ts
│       └── User.ts
├── __tests__/
│   ├── api/reviews.test.ts           # Review validation + rating rules
│   ├── components/ReviewModal.test.tsx
│   ├── components/StarRating.test.tsx
│   └── lib/imageHosts.test.ts
├── scripts/
│   ├── seed.mjs                      # Seed test sitters into MongoDB
│   └── accept-booking.mjs            # Accept most recent pending booking
├── Dockerfile                        # Multi-stage production image (+ seed target)
├── docker-compose.yml                # App + MongoDB (+ one-off seed service)
└── .env.example                      # All environment variables, documented
```

---

## Database Models

**User** — Synced from Clerk on first sign-in. Stores `firstName`, `lastName`, `email`, `phone`, `location`, `role` (owner / sitter / both), `onboarded`.

**SitterProfile** — One-to-one with User (sitter/both roles). Stores `bio`, `services`, `hourlyRate`, `experience`, `averageRating`, `reviewCount`, `profilePhoto`, and `availability` (per-day toggle + time range for Mon–Sun).

**Pet** — Belongs to a User (owner). Stores `name`, `breed`, `age`, `size`, `notes`, `photo`.

**Booking** — Links `ownerId`, `sitterId`, `sitterProfileId`, `petId`. Tracks `service`, `startDate`, `endDate`, `durationHours`, `totalPrice`, `status` (pending → accepted → active → completed / declined / cancelled), `paymentStatus` (unpaid / paid / refunded), `stripeSessionId`, `reviewed`.

**Message** — Belongs to a Booking. Stores `senderId`, `text`, `readBy` (array of user IDs for unread tracking).

**Review** — One-per-booking. Stores `rating` (1–5), `comment`, links to `reviewerId`, `sitterId`, `sitterProfileId`. Triggers recalculation of sitter's `averageRating` and `reviewCount` on creation.

---

## Getting Started

### Prerequisites
- Node.js 20.9+ (required by Next.js 16)
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Accounts for: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [Resend](https://resend.com), [UploadThing](https://uploadthing.com)

### 1. Clone and install

```bash
git clone https://github.com/Sanjeewaniaryal/Kiki-Paws-final.git
cd Kiki-Paws-final
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (optional — emails are skipped if not set)
RESEND_API_KEY=re_...

# UploadThing (optional — photo uploads require this)
UPLOADTHING_TOKEN=...

# Admin panel (comma-separated Clerk user IDs)
ADMIN_CLERK_IDS=user_...

# Public URL, used for Stripe redirects and email links (defaults to http://localhost:3000)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Set up the Stripe webhook (for payments to complete)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copy the `whsec_...` secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 5. Seed test sitters (optional)

```bash
npm run seed
```

Creates 4 test sitter profiles so you can test the browse and booking flow immediately.

---

## Running with Docker

Requires Docker Desktop (or Docker Engine with Compose v2).

```bash
cp .env.example .env      # then fill in the keys
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). To use a different port, run `APP_PORT=8080 docker compose up --build`.

- `app` is the Next.js production build (`output: "standalone"`).
- `mongo` is a local MongoDB 7 with a persistent volume. It is used unless `MONGODB_URI` is set in `.env`, for example to a MongoDB Atlas cluster.
- To add the test sitters, run `docker compose run --rm seed`.

`NEXT_PUBLIC_*` values are compiled into the frontend, so rebuild (`--build`) after changing them.

---

## Running Tests

```bash
npm test
```

| Suite | Coverage |
|---|---|
| `StarRating` component | Rendering, filled stars, interactivity, accessibility |
| `ReviewModal` component | Submission, validation, char counter, cancel |
| Review rules (`lib/reviews.ts`) | Input validation, who can review, average rating |

---

## Key User Flows

### Booking & Payment
1. Owner browses `/sitters`, views a profile, clicks **Book Now**
2. Fills in pet, service, and dates → booking created with status `pending`
3. Sitter accepts via **My Bookings → As Sitter**
4. Owner clicks **Pay Now** → redirected to Stripe Checkout
5. On payment success, Stripe webhook fires → booking flips to `active`
6. Sitter marks booking `completed`
7. Owner leaves a star rating and review

### Real-time Chat
- Either party clicks **Message** on any booking card
- Messages delivered via Server-Sent Events with 2-second polling
- Unread badge on the dashboard refreshes every 30 seconds
- Messages marked as read automatically when the chat drawer opens

### Sitter Onboarding
1. Sign up and complete onboarding — choose role **Sitter** or **Owner & Sitter**
2. Set location, bio, services, hourly rate, and experience
3. Go to **Dashboard → Sitter Profile** to set weekly availability and upload a profile photo
4. Profile is immediately visible on the `/sitters` browse page

---

## Test Credentials (Stripe sandbox)

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 9995` | Payment declined |

Use any future expiry date and any 3-digit CVC.

---

## Deployment

The app runs on **Google Cloud Run**, using the same Docker image as `docker compose`.

| | |
|---|---|
| URL | https://kikipaws-157616526370.europe-west1.run.app |
| GCP project | `kikipaws-dbgn8w` |
| Region | `europe-west1` |
| Cloud Run service | `kikipaws` |
| Image | `europe-west1-docker.pkg.dev/kikipaws-dbgn8w/kikipaws/app` (Artifact Registry) |
| Database | MongoDB Atlas (the compose `mongo` container is for local runs only) |
| Scaling | 0–2 instances, 512 MiB. The first request after a quiet period takes a few seconds while an instance starts. |

### Redeploying

Requires the [gcloud CLI](https://cloud.google.com/sdk/docs/install), signed in with access to the project.

```bash
# One-time: let Docker push to Artifact Registry
gcloud auth configure-docker europe-west1-docker.pkg.dev

# Build for Cloud Run (linux/amd64, also needed on Apple Silicon) and push
docker buildx build --platform linux/amd64 --target runner \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... \
  --build-arg NEXT_PUBLIC_APP_URL=https://kikipaws-157616526370.europe-west1.run.app \
  -t europe-west1-docker.pkg.dev/kikipaws-dbgn8w/kikipaws/app:v2 --push .

# Deploy the new image. Runtime env vars are kept from the previous revision.
gcloud run deploy kikipaws --project=kikipaws-dbgn8w --region=europe-west1 \
  --image=europe-west1-docker.pkg.dev/kikipaws-dbgn8w/kikipaws/app:v2
```

On the first deploy, pass the variables from `.env` with `--env-vars-file` (a YAML file of `KEY: "value"` lines), along with `--port=3000 --allow-unauthenticated --timeout=3600`. The long timeout keeps the chat's Server-Sent Events connection open.

### Stripe webhook

In the Stripe Dashboard, under **Developers → Webhooks**, add an endpoint for `https://kikipaws-157616526370.europe-west1.run.app/api/webhook/stripe` with the `checkout.session.completed` event. Set its signing secret on the service:

```bash
gcloud run services update kikipaws --project=kikipaws-dbgn8w --region=europe-west1 \
  --update-env-vars=STRIPE_WEBHOOK_SECRET=whsec_...
```
