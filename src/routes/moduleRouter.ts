import express from 'express';
import { authorize } from '../middlewares/authMiddleware';
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from '../controllers/moduleController';

const router = express.Router();

// Create a new module
router.post('/add', createModule);

// Retrieve all modules
router.get('/', getModules);

// Retrieve a single module by ID
router.get('/:id', getModuleById);

// Update a module by ID
router.patch('/:id', updateModule);

// Delete a module by ID
router.delete('/:id', deleteModule);

export default router;
