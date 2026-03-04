import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import userRoleMiddleware from '../Middleware/userRoleMiddleware.js';
import { addToCart, clearCart, getMyCart, removeCartItem, updateCartItem } from '../Controller/cartController.js';


const router = express.Router();

router.post('/add-cart',authMiddleware,userRoleMiddleware,addToCart);
router.delete('/clear-cart',authMiddleware,userRoleMiddleware,clearCart);
router.get('/get-cart',authMiddleware,userRoleMiddleware,getMyCart);
router.put('/update-cart',authMiddleware,userRoleMiddleware,updateCartItem);
router.delete('/remove-cart',authMiddleware,userRoleMiddleware,removeCartItem);

export default router;
