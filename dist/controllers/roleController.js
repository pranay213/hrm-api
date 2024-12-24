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
exports.getRoles = exports.createRole = void 0;
const Role_1 = __importDefault(require("../models/Role")); // Assuming the Role model is in models/Role
const Modules_1 = __importDefault(require("../models/Modules"));
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, checkedModules } = req.body;
        // Validate input
        if (!name || !Array.isArray(checkedModules)) {
            return res.status(400).json({
                error: 'Invalid input data. Name and checkedModules are required.',
            });
        }
        // Check if role with the same name already exists
        const existingRole = yield Role_1.default.findOne({ name });
        if (existingRole) {
            return res
                .status(409)
                .json({ error: 'Role with the same name already exists' });
        }
        // Get all modules
        const allModules = yield Modules_1.default.find();
        // Create permissions object: true for checkedModules, false for others
        const permissions = allModules.map((module) => ({
            module: module._id,
            permission: checkedModules.includes(module._id.toString()),
        }));
        // Create and save the role
        const newRole = yield Role_1.default.create({ name, permissions });
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: newRole,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create role',
            error: error.message,
        });
    }
});
exports.createRole = createRole;
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findRoles = yield Role_1.default.find();
        res.status(200).send({
            success: true,
            message: 'roles fetched',
            data: findRoles,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.getRoles = getRoles;
