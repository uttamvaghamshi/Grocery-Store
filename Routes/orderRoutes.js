import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import userRoleMiddleware from "../Middleware/userRoleMiddleware.js";
import storeAdminMiddleware from '../Middleware/storeAdminMiddleware.js';
import riderRoleMiddleware from '../Middleware/riderRoleMiddleware.js';

import { acceptOrder, AssignRider, cancelOrder, completeDelivery, getSingleOrder, getStoreOrders, getUserOrders, placeOrder } from "../Controller/orderController.js";

const router = express.Router();

router.get('/get-orders',authMiddleware,storeAdminMiddleware,getStoreOrders);
router.post("/place", authMiddleware,userRoleMiddleware, placeOrder);

router.get("/my-orders", authMiddleware,userRoleMiddleware, getUserOrders);

router.get("/:id", authMiddleware,userRoleMiddleware, getSingleOrder);

router.put("/cancel/:id", authMiddleware,userRoleMiddleware, cancelOrder);

// router.put("/confirm/:id", authMiddleware,riderRoleMiddleware, confirmOrder);

//Accept Orders By Admins
router.patch('/accept-order/:orderId',authMiddleware,storeAdminMiddleware,acceptOrder);

router.patch('/assign-rider/:orderId',authMiddleware,storeAdminMiddleware,AssignRider);

router.patch('/complete-delivered/:orderId',authMiddleware,riderRoleMiddleware,completeDelivery);


export default router;