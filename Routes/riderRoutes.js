import { acceptOrder, deleteRider, getAllRiders, getMyActiveOrders, getPendingOrders, getRiderWallet, getSingleRider, getWalletHistory, loginRider, registerRider, riderProfile, toggleAvailabilty, updateKycStatus, updateOrderStatus, updateRider } from '../Controller/riderController.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import riderRoleMiddleware from '../Middleware/riderRoleMiddleware.js';
import adminRoleMiddleware from '../Middleware/adminRoleMiddleware.js';
import express from 'express';
import upload from '../Middleware/upload.js';
import { profile } from '../Controller/UserController.js';

const router = express.Router();

router.post("/register", upload.single("image"), registerRider);
router.post('/login-rider',loginRider);
router.get('/get-riders',authMiddleware,adminRoleMiddleware,getAllRiders);
router.get('/get-rider/:id',authMiddleware,adminRoleMiddleware,getSingleRider);
router.put('/update-rider/:id',authMiddleware,adminRoleMiddleware,updateRider);
router.delete('/delete-rider/:id',authMiddleware,adminRoleMiddleware,deleteRider);
router.put('/update-kyc/:id',authMiddleware,adminRoleMiddleware,updateKycStatus);
router.put('/update-available/:id',authMiddleware,riderRoleMiddleware,toggleAvailabilty);
router.get('/pending-orders',authMiddleware,riderRoleMiddleware,getPendingOrders);
router.put('/accept-orders/:orderId',authMiddleware,riderRoleMiddleware,acceptOrder);
router.get('/my-active',authMiddleware,riderRoleMiddleware,getMyActiveOrders);
router.put('/update-status',authMiddleware,riderRoleMiddleware,updateOrderStatus);
router.get('/get-wallet-history',authMiddleware,riderRoleMiddleware,getWalletHistory);
router.get('/get-rider-wallet',authMiddleware,riderRoleMiddleware,getRiderWallet);
router.get('/profile',authMiddleware,riderRoleMiddleware,riderProfile);


export default router;