import express from 'express';
import { addSaleItems, getSaleById, getSales } from '../controllers/saleController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect, addSaleItems).get(protect, admin, getSales);
router.route('/:id').get(protect, getSaleById);

export default router;
