import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import SitterProfile from '@/lib/models/SitterProfile'
import User from '@/lib/models/User'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const service = searchParams.get('service')

  await connectDB()

  const filter = service ? { services: service } : {}
  const sitterProfiles = await SitterProfile.find(filter).populate('userId', 'firstName lastName photo location').lean()

  // Only return sitters whose userId populated successfully
  const sitters = sitterProfiles.filter((s) => s.userId)

  return NextResponse.json(sitters)
}
