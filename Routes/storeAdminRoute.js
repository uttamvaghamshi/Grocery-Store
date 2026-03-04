import express from 'express';
import { getAllStores, loginStoreAdmin, registerStoreAdmin } from '../Controller/StoreAdminController.js';
const router = express.Router();

router.post('/register-store',registerStoreAdmin);
router.post('/login-store',loginStoreAdmin);
router.get('/get-all-stores',getAllStores);

export default router;