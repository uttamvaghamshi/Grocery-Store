import express from "express";
import { deleteStoreAdmins, getAllStoreAdmins, getAllUsers, getDashboardStats, loginSuperAdmin, registerSuperAdmin } from "../Controller/superAdminController.js";
import { getAllRiders } from "../Controller/riderController.js";
import AuthMiddleware from '../Middleware/authMiddleware.js';
import superAdminMiddleware from '../Middleware/adminRoleMiddleware.js';



const router = express.Router();

router.post('/register-admin',registerSuperAdmin);
router.post('/login-admin',loginSuperAdmin);
router.delete('/store/:id',AuthMiddleware,superAdminMiddleware,deleteStoreAdmins);
router.get('/get-stores',AuthMiddleware,superAdminMiddleware,getAllStoreAdmins);
router.get('/get-riders',AuthMiddleware,superAdminMiddleware,getAllRiders);
router.get('/get-users',AuthMiddleware,superAdminMiddleware,getAllUsers);
router.get('/get-stats',AuthMiddleware,superAdminMiddleware,getDashboardStats);



export default router;