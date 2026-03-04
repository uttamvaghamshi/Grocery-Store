import express from "express";
import multer from "multer";
import { deleteProductImage, getProductImages, uploadProductImage } from "../Controller/productImageController.js";
import AuthMiddleware from '../Middleware/authMiddleware.js';
import StoreAdminMiddleware from '../Middleware/storeAdminMiddleware.js';
import upload from '../Middleware/upload.js';

const router = express.Router();


router.post('/upload',AuthMiddleware,StoreAdminMiddleware,upload.single("image"),uploadProductImage);
router.get('/:product_id',AuthMiddleware,StoreAdminMiddleware,getProductImages);
router.delete('/:image_id',AuthMiddleware,StoreAdminMiddleware,deleteProductImage);

export default router;