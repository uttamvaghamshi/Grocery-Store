import express from 'express';
import { loginStoreAdmin, registerStoreAdmin } from '../Controller/StoreAdminController.js';



const router = express.Router();

router.post('/login',loginStoreAdmin);
router.post('/register',registerStoreAdmin);

export default router;