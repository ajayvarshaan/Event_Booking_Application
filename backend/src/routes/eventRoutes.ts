import { Router } from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
