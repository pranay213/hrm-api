"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roleController_1 = require("../controllers/roleController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Create a new role
router.post('/add', roleController_1.createRole);
// Get all roles
router.get('/', roleController_1.getAllRoles);
// Get a single role by ID
router.get('/:id', roleController_1.getRoleById);
// Update a role by ID
router.patch('/:id', roleController_1.updateRole);
// Deactivate a role (soft delete) by ID
router.patch('/roles/:id/deactivate', roleController_1.deactivateRole);
exports.default = router;
