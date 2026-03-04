import express from "express";
import authMiddleware from '../Middleware/authMiddleware.js';
import upload from '../Middleware/upload.js';
import riderRoleMiddleware from '../Middleware/riderRoleMiddleware.js';
import adminRoleMiddleware from '../Middleware/adminRoleMiddleware.js';
import { getRiderAadhar, updateStatus, uploadAadhar } from "../Controller/aadharController.js";

const router = express.Router();

router.post('/upload-aadhar/:rider_id',authMiddleware,riderRoleMiddleware,upload.single("aadhar_image"),uploadAadhar);
router.get('/get-aadhar/:rider_id',authMiddleware,riderRoleMiddleware,getRiderAadhar);
router.put('/verify-aadhar/:id',authMiddleware,adminRoleMiddleware,updateStatus);

export default router;
