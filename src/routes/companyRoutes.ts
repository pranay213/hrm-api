import { STORAGE } from '../utils/multer';
import {
  createCompany,
  deactivateCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  uploadImage,
} from '../controllers/companyController';
import express from 'express';
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: STORAGE });

// Create a new company
router.post('/add', createCompany);

router.post('/upload-logo', upload.single('image'), uploadImage);

// Get all companies
router.get('/', getAllCompanies);

// Get a single company by ID
router.get('/:id', getCompanyById);

// Update a company by ID
router.put('/:id', updateCompany);

// Deactivate a company by ID
router.patch('/companies/:id/deactivate', deactivateCompany);

export default router;
