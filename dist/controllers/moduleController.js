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
exports.getModuleByName = exports.getAllModules = exports.createModule = void 0;
const Modules_1 = __importDefault(require("../models/Modules"));
// Adjust the path to your Module model
// Create a new module
// Create a new module
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, backendPath, frontEndPath, parentId, metadata } = req.body;
        const newModule = new Modules_1.default({
            name,
            backendPath,
            frontEndPath,
            parent: parentId || null,
            metadata: metadata || {},
        });
        const savedModule = yield newModule.save();
        // Update the parent's children array if a parentId is provided
        if (parentId) {
            yield Modules_1.default.findByIdAndUpdate(parentId, {
                $push: { children: savedModule._id },
            });
        }
        res.status(201).json({
            success: true,
            message: 'Module created Successfully',
            data: savedModule,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Module creation failed',
            error: error.message,
        });
    }
});
exports.createModule = createModule;
// Get all modules
// Helper function to recursively build the module hierarchy
const buildHierarchy = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (parentId = null) {
    const modules = yield Modules_1.default.find({ parent: parentId }).lean();
    return Promise.all(modules.map((module) => __awaiter(void 0, void 0, void 0, function* () {
        return (Object.assign(Object.assign({}, module), { children: yield buildHierarchy(module._id) }));
    })));
});
// Retrieve all modules in a nested structure
const getAllModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hierarchy = yield buildHierarchy();
        res.status(200).json({
            succees: true,
            message: 'feched modules successfully',
            data: hierarchy,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'fetching modules Failed',
            error: error.message,
        });
    }
});
exports.getAllModules = getAllModules;
// Get a specific module by name
const getModuleByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const module = yield Modules_1.default.findOne({ name });
        if (!module) {
            return res
                .status(404)
                .json({ success: false, message: 'Module not found' });
        }
        res.status(200).json({ module });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch module',
            error: error.message,
        });
    }
});
exports.getModuleByName = getModuleByName;
