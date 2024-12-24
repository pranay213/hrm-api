"use strict";
// src/controllers/employeeController.ts
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
exports.getEmployeesByBranch = exports.createEmployee = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
// Create a new employee
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchId, name, role, email } = req.body;
        const newEmployee = new Employee_1.default({
            branchId,
            name,
            role,
            email,
            createdAt: new Date(),
        });
        yield newEmployee.save();
        res.status(201).json({
            message: 'Employee created successfully',
            employee: newEmployee,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to create employee', details: error.message });
    }
});
exports.createEmployee = createEmployee;
// Get employees for a branch
const getEmployeesByBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { branchId } = req.params;
        const employees = yield Employee_1.default.find({ branchId });
        res.status(200).json(employees);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'Failed to fetch employees', details: error.message });
    }
});
exports.getEmployeesByBranch = getEmployeesByBranch;
