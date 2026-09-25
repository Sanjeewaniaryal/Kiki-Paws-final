import mongoose from 'mongoose'

// Cache connection across hot reloads in dev
const cached = global as typeof global & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.mongoose!.conn) return cached.mongoose!.conn

  if (!cached.mongoose!.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not defined in environment variables')
    cached.mongoose!.promise = mongoose.connect(uri).then((m) => m)
  }

  try {
    cached.mongoose!.conn = await cached.mongoose!.promise
  } catch (err) {
    cached.mongoose!.promise = null
    throw err
  }
  return cached.mongoose!.conn
}
