import express from 'express';
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, getPriceHistory, getTopProducts } from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/price-history', getPriceHistory);

export default router;
