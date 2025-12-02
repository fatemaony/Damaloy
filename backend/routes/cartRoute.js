import express from 'express';
import { addToCart, getCart, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
router.delete('/clear/:userId', clearCart);

export default router;
