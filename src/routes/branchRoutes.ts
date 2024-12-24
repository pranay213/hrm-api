// src/routes/branchRoutes.ts

import express from 'express';
import { createBranch } from '../controllers/branchController';

const router = express.Router();

router.post('/create', createBranch); // Endpoint for creating a branch

export default router;
