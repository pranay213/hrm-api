"use strict";
// src/controllers/companyController.ts
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
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanies = exports.createCompany = void 0;
const Company_1 = __importDefault(require("../models/Company"));
// Create a new company
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, accountType } = req.body;
        // Create a new company in the database
        const newCompany = new Company_1.default({
            name,
            accountType,
            createdAt: new Date(),
        });
        yield newCompany.save();
        res
            .status(201)
            .json({ message: 'Company created successfully', company: newCompany });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to create company', details: error.message });
    }
});
exports.createCompany = createCompany;
// Get all companies
const getCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield Company_1.default.find();
        res.status(200).json(companies);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to fetch companies', details: error.message });
    }
});
exports.getCompanies = getCompanies;
// Get a specific company by ID
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const company = yield Company_1.default.findById(id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to fetch company', details: error.message });
    }
});
exports.getCompanyById = getCompanyById;
// Update a company
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedCompany = yield Company_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({
            message: 'Company updated successfully',
            company: updatedCompany,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to update company', details: error.message });
    }
});
exports.updateCompany = updateCompany;
// Delete a company
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCompany = yield Company_1.default.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to delete company', details: error.message });
    }
});
exports.deleteCompany = deleteCompany;
