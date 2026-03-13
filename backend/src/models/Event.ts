import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  price: number;
  capacity: number;
  availableSeats: number;
  image: string;
  organizer: Types.ObjectId;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: { type: String, default: 'https://via.placeholder.com/400x300' },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
