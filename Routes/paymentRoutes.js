import express from "express";
import { createPayment, getAllPayments, updatePaymentStatus } from "../Controller/paymentController.js";
import AuthMiddleware from '../Middleware/authMiddleware.js';
import AdminRoleMiddlware from '../Middleware/adminRoleMiddleware.js';
import UserRoleMiddleware from '../Middleware/userRoleMiddleware.js';



const router = express.Router();

router.get('/get-payments',AuthMiddleware,AdminRoleMiddlware,getAllPayments);
router.post('/create-payment',AuthMiddleware,UserRoleMiddleware,createPayment);
router.put('/update-payment/:id',AuthMiddleware,AdminRoleMiddlware,updatePaymentStatus);
export default router;
