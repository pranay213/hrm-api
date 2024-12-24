import express from 'express';
import { createRole, getRoles } from '../controllers/roleController';
import { authorize } from '../middlewares/authMiddleware';

const router: any = express.Router();

router.post('/add', authorize(['SUPER_ADMIN']), createRole);
router.get('/', authorize(['SUPER_ADMIN', 'ADMIN']), getRoles);
// router.put('/:roleId', authorize(['SUPER_ADMIN']), updateRole);
// router.delete('/:roleId', authorize(['SUPER_ADMIN']), deleteRole);

export default router;
