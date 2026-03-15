import mongoose, { Schema, Document } from 'mongoose'

export interface ISitterProfile extends Document {
  userId: mongoose.Types.ObjectId
  bio: string
  services: ('sitting' | 'walking' | 'boarding' | 'dropin' | 'grooming')[]
  hourlyRate: number
  location: string
  experience: string
  createdAt: Date
  updatedAt: Date
}

const SitterProfileSchema = new Schema<ISitterProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '' },
    services: {
      type: [String],
      enum: ['sitting', 'walking', 'boarding', 'dropin', 'grooming'],
      default: [],
    },
    hourlyRate: { type: Number, default: 0 },
    location: { type: String, default: '' },
    experience: { type: String, default: '' },
  },
  { timestamps: true }
)

const SitterProfile =
  mongoose.models.SitterProfile ||
  mongoose.model<ISitterProfile>('SitterProfile', SitterProfileSchema)

export default SitterProfile
