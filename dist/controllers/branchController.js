"use strict";
// src/controllers/branchController.ts
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
exports.getBranchesByCompany = exports.createBranch = void 0;
const Branch_1 = __importDefault(require("../models/Branch"));
// Create a new branch
const createBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId, name } = req.body;
        const newBranch = new Branch_1.default({
            companyId,
            name,
            createdAt: new Date(),
        });
        yield newBranch.save();
        res
            .status(201)
            .json({ message: 'Branch created successfully', branch: newBranch });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to create branch', details: error.message });
    }
});
exports.createBranch = createBranch;
// Get all branches for a company
const getBranchesByCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyId } = req.params;
        const branches = yield Branch_1.default.find({ companyId });
        res.status(200).json(branches);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to fetch branches', details: error.message });
    }
});
exports.getBranchesByCompany = getBranchesByCompany;
