import Stripe from 'stripe'

let client: Stripe | null = null

// Created on first use so the app can be built without STRIPE_SECRET_KEY present.
export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
    client = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
  }
  return client
}
