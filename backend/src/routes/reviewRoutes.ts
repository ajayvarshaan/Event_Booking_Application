import { Router } from 'express';
import { createReview, getEventReviews, updateReview, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createReview);
router.get('/event/:eventId', getEventReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;
