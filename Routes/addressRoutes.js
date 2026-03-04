import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import userRoleMiddleware from '../Middleware/userRoleMiddleware.js';
import { addAddress, deleteAddress, getMyAddress, updateAddress } from '../Controller/addressController.js';

const router = express.Router();
router.post('/add-address',authMiddleware,userRoleMiddleware,addAddress);
router.get('/get-address',authMiddleware,userRoleMiddleware,getMyAddress);
router.put('/update-address/:addressId',authMiddleware,userRoleMiddleware,updateAddress);
router.put('/delete-address/:addressId',authMiddleware,userRoleMiddleware,deleteAddress);

export default router;