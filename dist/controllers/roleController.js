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
exports.deactivateRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const Role_1 = __importDefault(require("../models/Role"));
// Create a new role
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isActive } = req.body;
        const existingRole = yield Role_1.default.findOne({ name });
        if (existingRole) {
            res.status(400).json({
                success: false,
                message: 'Role with this name already exists',
            });
            return;
        }
        const role = new Role_1.default({
            name,
            description,
            isActive: isActive !== undefined ? isActive : true,
        });
        yield role.save();
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error creating role',
            error: typedError.message,
        });
        return;
    }
});
exports.createRole = createRole;
// Get all roles
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_1.default.find();
        res.status(200).json({
            success: true,
            message: 'Roles fetched successfully',
            data: roles,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error fetching roles',
            error: typedError.message,
        });
        return;
    }
});
exports.getAllRoles = getAllRoles;
// Get a single role by ID
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield Role_1.default.findById(id);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Role fetched successfully',
            data: role,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error fetching role',
            error: typedError.message,
        });
        return;
    }
});
exports.getRoleById = getRoleById;
// Update a role by ID
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedRole = yield Role_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updatedRole) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error updating role',
            error: typedError.message,
        });
        return;
    }
});
exports.updateRole = updateRole;
// Delete (deactivate) a role by ID
const deactivateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deactivatedRole = yield Role_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!deactivatedRole) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Role deactivated successfully',
            data: deactivatedRole,
        });
        return;
    }
    catch (error) {
        const typedError = error;
        res.status(500).json({
            success: false,
            message: 'Error deactivating role',
            error: typedError.message,
        });
        return;
    }
});
exports.deactivateRole = deactivateRole;
