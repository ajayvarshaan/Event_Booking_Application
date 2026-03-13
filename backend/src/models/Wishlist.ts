import mongoose, { Schema, Document } from 'mongoose';

interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  events: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema);
