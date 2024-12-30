import express from 'express';

import { authorize } from '../middlewares/authMiddleware';
import {
  createModule,
  updateModule,
  getAllModules,
  getModuleById,
} from '../controllers/moduleController';

const router: any = express.Router();

router.post('/add', authorize(['SUPER_ADMIN']), createModule);
router.get('/', authorize(['SUPER_ADMIN', 'ADMIN']), getAllModules);

router.patch('/:id', authorize(['SUPER_ADMIN']), updateModule);
router.get('/:id', authorize(['SUPER_ADMIN']), getModuleById);
// router.delete('/:roleId', authorize(['SUPER_ADMIN']), deleteRole);

export default router;
