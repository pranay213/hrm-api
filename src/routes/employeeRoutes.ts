// src/routes/employeeRoutes.ts

import express from 'express';
import {
  createEmployee,
  // getEmployees,
} from '../controllers/employeeController';

const router = express.Router();

router.post('/create', createEmployee); // Endpoint for creating an employee
// router.get('/', getEmployees); // Endpoint for listing employees

export default router;
