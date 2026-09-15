import { Router } from 'express';
import auth, { requireBuilderAccess } from '../middleware/auth.js';
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../controllers/resumeController.js';

const router = Router();

router.use(auth, requireBuilderAccess);

router.get('/', listResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);

export default router;
