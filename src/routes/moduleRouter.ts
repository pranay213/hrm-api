import express from 'express';

import { authorize } from '../middlewares/authMiddleware';
import { createModule, getAllModules } from '../controllers/moduleController';

const router: any = express.Router();

router.post('/add', authorize(['SUPER_ADMIN']), createModule);
router.get('/', authorize(['SUPER_ADMIN', 'ADMIN']), getAllModules);

// router.put('/:roleId', authorize(['SUPER_ADMIN']), updateRole);
// router.delete('/:roleId', authorize(['SUPER_ADMIN']), deleteRole);

export default router;
