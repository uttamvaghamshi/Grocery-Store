import express from "express";
import upload from "../Middleware/upload.js";
import isRider from '../Middleware/riderRoleMiddleware.js';
import isAdmin from '../Middleware/adminRoleMiddleware.js';
import authMiddleware from '../Middleware/authMiddleware.js';
import { uploadLicence,updateLicenseStatus } from "../Controller/licenceController.js";

const router = express.Router();


router.post("/upload/:id",authMiddleware, isRider, upload.single("license_image"), uploadLicence);

router.put("/verify/:id",authMiddleware, isAdmin, updateLicenseStatus);

export default router;