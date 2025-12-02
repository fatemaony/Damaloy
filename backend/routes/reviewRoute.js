import express from 'express';
import { addReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', addReview);
router.get('/:productId', getReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
