import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import SitterProfile from '@/lib/models/SitterProfile'
import '@/lib/models/User' // register User model for populate

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const service = searchParams.get('service')

    await connectDB()

    const filter = service ? { services: service } : {}
    const sitterProfiles = await SitterProfile.find(filter).populate('userId', 'firstName lastName photo location').lean()

    const sitters = sitterProfiles.filter((s) => s.userId)

    return NextResponse.json(sitters)
  } catch (err) {
    console.error('[/api/sitters]', err)
    return NextResponse.json({ error: 'Failed to fetch sitters' }, { status: 500 })
  }
}
