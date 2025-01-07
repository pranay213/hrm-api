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
exports.deleteModule = exports.updateModule = exports.getModuleById = exports.getModules = exports.createModule = void 0;
const Modules_1 = __importDefault(require("../models/Modules"));
// Create a new module
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, icon, status } = req.body;
        // Validation
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Name is required',
            });
            return;
        }
        const existingModule = yield Modules_1.default.findOne({ name });
        if (existingModule) {
            res.status(400).json({
                success: false,
                message: 'Module with this name already exists',
            });
            return;
        }
        const newModule = new Modules_1.default({ name, icon, status });
        const savedModule = yield newModule.save();
        res.status(201).json({
            success: true,
            message: 'Module created successfully',
            data: savedModule,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create module',
            error: error.message,
        });
        return;
    }
});
exports.createModule = createModule;
// Get all modules
const getModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modules = yield Modules_1.default.find();
        res.status(200).json({
            success: true,
            message: 'Modules retrieved successfully',
            data: modules,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch modules',
            error: error.message,
        });
        return;
    }
});
exports.getModules = getModules;
// Get a single module by ID
const getModuleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validation
        if (!id || id.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Module ID is required',
            });
            return;
        }
        const module = yield Modules_1.default.findById(id);
        if (!module) {
            res.status(404).json({
                success: false,
                message: 'Module not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Module retrieved successfully',
            data: module,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch module',
            error: error.message,
        });
        return;
    }
});
exports.getModuleById = getModuleById;
// Update a module by ID
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, icon, status } = req.body;
        // Validation
        if (!id || id.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Module ID is required',
            });
            return;
        }
        if (name) {
            const existingModule = yield Modules_1.default.findOne({ name, _id: { $ne: id } });
            if (existingModule) {
                res.status(400).json({
                    success: false,
                    message: 'Another module with this name already exists',
                });
                return;
            }
        }
        const updatedModule = yield Modules_1.default.findByIdAndUpdate(id, { name, icon, status }, { new: true, runValidators: true });
        if (!updatedModule) {
            res.status(404).json({
                success: false,
                message: 'Module not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Module updated successfully',
            data: updatedModule,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update module',
            error: error.message,
        });
        return;
    }
});
exports.updateModule = updateModule;
// Delete a module by ID
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validation
        if (!id || id.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Module ID is required',
            });
            return;
        }
        const deletedModule = yield Modules_1.default.findByIdAndDelete(id);
        if (!deletedModule) {
            res.status(404).json({
                success: false,
                message: 'Module not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Module deleted successfully',
            data: deletedModule,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete module',
            error: error.message,
        });
        return;
    }
});
exports.deleteModule = deleteModule;
