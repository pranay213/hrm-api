"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createCompany = exports.uploadImage = void 0;
const Company_1 = __importDefault(require("../models/Company"));
const Accounts_1 = __importDefault(require("../models/Accounts"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = require("../utils/multer");
const Role_1 = __importDefault(require("../models/Role"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const SALT_ROUNDS = 10; // Salt rounds for password hashing
// Create a new company
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, multer_1.uploadImageToDb)(req, res);
        if (result.error) {
            res.status(result.status || 500).json({
                success: false,
                message: result.message,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: result.data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
});
exports.uploadImage = uploadImage;
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, address, password, permissions, logo } = req.body; // Extract permissions string
        // console.log('Uploaded file:', req.file, permissions); // Check the uploaded file
        // Validate required fields
        if (!name || !email || !address || !password || !logo || !permissions) {
            res.status(400).json({
                success: false,
                message: 'All fields and a logo file are required',
            });
            return;
        }
        const createdBy = req.user.id;
        // Check for existing company or account
        const existingCompany = yield Company_1.default.findOne({ name });
        const existingAccount = yield Accounts_1.default.findOne({ email });
        if (existingCompany || existingAccount) {
            res.status(400).json({
                success: false,
                message: 'Company with this name or email already exists',
            });
            return;
        }
        // Creating Account
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        const roleId = yield Role_1.default.findOne({ name: 'COMPANY' }).select('_id');
        const newAccount = new Accounts_1.default({
            firstName: name,
            lastName: ' ',
            email,
            password: hashedPassword,
            roleType: roleId, // Explicitly set role type
        });
        const createdAccount = yield newAccount.save();
        if (!createdAccount) {
            res.status(400).json({
                success: false,
                message: 'Account creation failed',
            });
            return;
        }
        // Create the company
        const company = new Company_1.default({
            name,
            email,
            address,
            createdBy: req.user.id,
            accountId: newAccount._id,
            permissions, // Assign permissions array
            logo: logo, // Save Cloudinary URL
        });
        const newCompany = yield company.save();
        if (!newCompany) {
            res.status(400).json({
                success: false,
                message: 'Company creation failed',
            });
            return;
        }
        // Create a new super admin account
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: { company: newCompany, account: createdAccount },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating company',
            error: error.message,
        });
    }
});
exports.createCompany = createCompany;
// Get all companies
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield Company_1.default.find();
        res.status(200).json({
            success: true,
            message: 'Companies fetched successfully',
            data: companies,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error fetching companies',
            error: typedError.message,
        });
        return;
    }
});
exports.getAllCompanies = getAllCompanies;
// Get a single company by ID
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const company = yield Company_1.default.findById(id)
            .populate('accountId', 'email')
            .lean();
        if (!company) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Company fetched successfully',
            data: Object.assign(Object.assign({}, company), { email: (_a = company.accountId) === null || _a === void 0 ? void 0 : _a.email }),
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: typedError.message,
        });
        return;
    }
});
exports.getCompanyById = getCompanyById;
// Update a company by ID
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedCompany = yield Company_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updatedCompany) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            data: updatedCompany,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error updating company',
            error: typedError.message,
        });
        return;
    }
});
exports.updateCompany = updateCompany;
// Delete (deactivate) a company by ID
const deactivateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deactivatedCompany = yield Company_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!deactivatedCompany) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Company deactivated successfully',
            data: deactivatedCompany,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error deactivating company',
            error: typedError.message,
        });
        return;
    }
});
exports.deactivateCompany = deactivateCompany;
