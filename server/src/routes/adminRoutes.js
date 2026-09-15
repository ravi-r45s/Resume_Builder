import { Router } from 'express';
import auth, { requireAdmin } from '../middleware/auth.js';
import { listUsers, setBuilderAccess } from '../controllers/adminController.js';

const router = Router();
router.use(auth, requireAdmin);
router.get('/users', listUsers);
router.patch('/users/:userId/access', setBuilderAccess);

export default router;
