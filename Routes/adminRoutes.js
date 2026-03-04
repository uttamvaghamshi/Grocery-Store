import express from 'express';
import { getAllStores, loginStoreAdmin, registerStoreAdmin } from '../Controller/StoreAdminController.js';



const router = express.Router();

router.post('/login',loginStoreAdmin);
router.post('/register',registerStoreAdmin);
router.get('/get-stores',getAllStores);

export default router;