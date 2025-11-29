import express from 'express';
import { createSellerApplication, getAllApplications, updateApplicationStatus, getSellerByEmail, deleteSeller } from '../controllers/sellerController.js';

const router = express.Router();

router.post('/', createSellerApplication);
router.get('/', getAllApplications);
router.patch('/:id/status', updateApplicationStatus);
router.get('/email/:email', getSellerByEmail);
router.delete('/:id', deleteSeller);

export default router;
