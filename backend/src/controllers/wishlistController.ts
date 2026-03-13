import { Response } from 'express';
import Wishlist from '../models/Wishlist';
import { AuthRequest } from '../middleware/auth';

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;
    const userId = req.user?._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        events: [eventId]
      });
    } else {
      if (!wishlist.events.includes(eventId)) {
        wishlist.events.push(eventId);
        await wishlist.save();
      }
    }

    await wishlist.populate('events');
    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;
    const userId = req.user?._id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      res.status(404).json({ message: 'Wishlist not found' });
      return;
    }

    wishlist.events = wishlist.events.filter(id => id.toString() !== eventId);
    await wishlist.save();
    await wishlist.populate('events');

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    let wishlist = await Wishlist.findOne({ user: userId }).populate('events');

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        events: []
      });
    }

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const isInWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = req.user?._id;

    const wishlist = await Wishlist.findOne({ user: userId });
    const isInWishlist = wishlist?.events.includes(eventId) || false;

    res.json({ isInWishlist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
