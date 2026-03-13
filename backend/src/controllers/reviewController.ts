import { Response } from 'express';
import Review from '../models/Review';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating || !comment) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const existingReview = await Review.findOne({ event: eventId, user: req.user?._id });
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this event' });
      return;
    }

    const review = await Review.create({
      event: eventId,
      user: req.user?._id,
      rating,
      comment
    });

    await review.populate('user', 'name email');
    res.status(201).json(review);
  } catch (error: any) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getEventReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const reviews = await Review.find({ event: eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    if (review.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate('user', 'name email');
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    if (review.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
