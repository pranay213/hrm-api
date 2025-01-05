import {
  createRole,
  deactivateRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from '../controllers/roleController';
import express from 'express';

const router = express.Router();

// Create a new role
router.post('/add', createRole);

// Get all roles
router.get('/', getAllRoles);

// Get a single role by ID
router.get('/:id', getRoleById);

// Update a role by ID
router.patch('/:id', updateRole);

// Deactivate a role (soft delete) by ID
router.patch('/roles/:id/deactivate', deactivateRole);

export default router;
