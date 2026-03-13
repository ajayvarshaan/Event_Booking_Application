import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  event: Types.ObjectId;
  user: Types.ObjectId;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const bookingSchema = new Schema<IBooking>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' }
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
