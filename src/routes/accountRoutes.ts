import express from 'express';
import {
  createSuperAdmin,
  deleteAccount,
  login,
  updateAccount,
} from '../controllers/accountsController';

const router: any = express.Router();

// Route for login
router.post('/login', login); // Login route

// // Route for creating a super admin
router.post('/create-super-admin', createSuperAdmin); // Create super admin route

// // Route for updating an account
// router.put('/update/:id', updateAccount); // Update account route

// // Route for deleting an account
// router.delete('/delete/:id', deleteAccount); // Delete account route

export default router;
