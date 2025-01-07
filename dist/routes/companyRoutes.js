"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("../utils/multer");
const companyController_1 = require("../controllers/companyController");
const express_1 = __importDefault(require("express"));
const multer = require('multer');
const router = express_1.default.Router();
const upload = multer({ storage: multer_1.STORAGE });
// Create a new company
router.post('/add', companyController_1.createCompany);
router.post('/upload-logo', upload.single('image'), companyController_1.uploadImage);
// Get all companies
router.get('/', companyController_1.getAllCompanies);
// Get a single company by ID
router.get('/:id', companyController_1.getCompanyById);
// Update a company by ID
router.put('/:id', companyController_1.updateCompany);
// Deactivate a company by ID
router.patch('/companies/:id/deactivate', companyController_1.deactivateCompany);
exports.default = router;
