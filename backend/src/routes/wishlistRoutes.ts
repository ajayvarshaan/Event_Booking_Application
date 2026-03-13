import { Router } from 'express';
import { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/add', protect, addToWishlist);
router.post('/remove', protect, removeFromWishlist);
router.get('/', protect, getWishlist);
router.get('/check/:eventId', protect, isInWishlist);

export default router;
