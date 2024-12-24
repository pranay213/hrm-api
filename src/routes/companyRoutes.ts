// src/routes/companyRoutes.ts

import express from 'express';
import { createCompany } from '../controllers/companyController';

const router = express.Router();

router.post('/create', createCompany); // Endpoint for creating a company

export default router;
