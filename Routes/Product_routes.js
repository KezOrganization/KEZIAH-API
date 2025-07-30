import express from 'express';
import { protect, adminOnly } from '../Middleware/authen_users.js';
import { parser } from '../Middleware/Upload.js';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct, searchProducts } from '../Controllers/Product_Con.js';

const productRoute = express.Router();

// Public routes
productRoute.get('/search', searchProducts)
productRoute.get('/', getProducts);
productRoute.get('/:id', getProductById);


// Admin-only routes
productRoute.post('/', protect, adminOnly, parser.single('image'), createProduct);
productRoute.put('/:id', protect, adminOnly, parser.single('image'), updateProduct);
productRoute.delete('/:id', protect, adminOnly, deleteProduct);

export default productRoute;
