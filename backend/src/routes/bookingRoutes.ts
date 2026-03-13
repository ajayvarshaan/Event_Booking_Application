import { Router } from 'express';
import { createBooking, getUserBookings, getAllBookings, getUserBookingStats, getCanceledBookingStats, cancelBooking } from '../controllers/bookingController';
import { protect, admin } from '../middleware/auth';

const router = Router();

router.get('/user-stats', protect, admin, getUserBookingStats);
router.get('/canceled-stats', protect, admin, getCanceledBookingStats);
router.get('/my-bookings', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings);
router.post('/', protect, createBooking);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
