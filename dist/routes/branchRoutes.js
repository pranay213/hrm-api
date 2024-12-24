"use strict";
// src/routes/branchRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const branchController_1 = require("../controllers/branchController");
const router = express_1.default.Router();
router.post('/create', branchController_1.createBranch); // Endpoint for creating a branch
exports.default = router;
