import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import stripe from '@/lib/stripe'
import { connectDB } from '@/lib/db'
import Booking from '@/lib/models/Booking'

// Stripe requires the raw body for signature verification — disable body parsing
export const config = { api: { bodyParser: false } }

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      await connectDB()
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        status: 'active',
      })
    }
  }

  return NextResponse.json({ received: true })
}
