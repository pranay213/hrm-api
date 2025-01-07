"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moduleController_1 = require("../controllers/moduleController");
const router = express_1.default.Router();
// Create a new module
router.post('/add', moduleController_1.createModule);
// Retrieve all modules
router.get('/', moduleController_1.getModules);
// Retrieve a single module by ID
router.get('/:id', moduleController_1.getModuleById);
// Update a module by ID
router.patch('/:id', moduleController_1.updateModule);
// Delete a module by ID
router.delete('/:id', moduleController_1.deleteModule);
exports.default = router;
