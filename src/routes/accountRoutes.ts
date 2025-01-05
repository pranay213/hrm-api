import express from 'express';
import {
  createSuperAdmin,
  deleteAccount,
  login,
  logoutAllDevices,
  logoutSingleDevice,
  updateAccount,
} from '../controllers/accountsController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router: any = express.Router();

// Route for login
router.post('/login', login); // Login route

// // Route for creating a super admin
router.post('/create-super-admin', createSuperAdmin); // Create super admin route

router.get('/logout', logoutSingleDevice); // Login route

router.get(
  '/logout-all',
  authenticate,
  authorize(['SUPER_ADMIN']),
  logoutAllDevices,
); // Login route

// // Route for updating an account
// router.put('/update/:id', updateAccount); // Update account route

// // Route for deleting an account
// router.delete('/delete/:id', deleteAccount); // Delete account route

export default router;
