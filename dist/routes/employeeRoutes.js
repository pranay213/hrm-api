"use strict";
// src/routes/employeeRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
router.post('/create', employeeController_1.createEmployee); // Endpoint for creating an employee
// router.get('/', getEmployees); // Endpoint for listing employees
exports.default = router;
