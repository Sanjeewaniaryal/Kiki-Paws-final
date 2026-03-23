import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  bookingId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  text: string
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
)

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)

export default Message
