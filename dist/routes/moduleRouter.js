"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const moduleController_1 = require("../controllers/moduleController");
const router = express_1.default.Router();
router.post('/add', (0, authMiddleware_1.authorize)(['SUPER_ADMIN']), moduleController_1.createModule);
router.get('/', (0, authMiddleware_1.authorize)(['SUPER_ADMIN', 'ADMIN']), moduleController_1.getAllModules);
// router.put('/:roleId', authorize(['SUPER_ADMIN']), updateRole);
// router.delete('/:roleId', authorize(['SUPER_ADMIN']), deleteRole);
exports.default = router;
