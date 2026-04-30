import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, createCategory, deleteCategory } from '../controllers/productController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/categories').get(protect, getCategories).post(protect, admin, createCategory);
router.route('/categories/:id').delete(protect, admin, deleteCategory);
router.route('/').get(protect, getProducts).post(protect, admin, createProduct);
router.route('/:id').get(protect, getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;
