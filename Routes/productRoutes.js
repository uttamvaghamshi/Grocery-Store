import express from 'express';
import { addProduct, deleteProduct, getMyStoreProducts,getNearestStoreProducts, getNearestStoreProductsByCategory, getSingleProduct, updateProduct } from '../Controller/ProductController.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import storeAdminMiddleware from '../Middleware/storeAdminMiddleware.js';
import UserRoleMiddleware from '../Middleware/userRoleMiddleware.js';


const router = express.Router();

router.get('/get-products',authMiddleware,UserRoleMiddleware,getNearestStoreProducts);
router.get('/get-products-store',authMiddleware,storeAdminMiddleware,getMyStoreProducts);
router.get('/get-product/:id',authMiddleware,storeAdminMiddleware,getSingleProduct);
router.post('/add-product',authMiddleware,storeAdminMiddleware,addProduct);
router.put('/update-product/:id',authMiddleware,storeAdminMiddleware,updateProduct);
router.delete('/delete-product/:id',authMiddleware,storeAdminMiddleware,deleteProduct);
router.get('/category/:categoryName',authMiddleware,UserRoleMiddleware,getNearestStoreProductsByCategory);
router.get('/get-my-products',authMiddleware,storeAdminMiddleware,getMyStoreProducts);


export default router;