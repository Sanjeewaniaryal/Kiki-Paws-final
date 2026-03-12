import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  photo: string
  role: 'owner' | 'sitter' | 'both'
  phone?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, default: '' },
    role: { type: String, enum: ['owner', 'sitter', 'both'], default: 'owner' },
    phone: { type: String },
    location: { type: String },
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
