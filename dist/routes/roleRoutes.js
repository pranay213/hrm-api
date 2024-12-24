"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("../controllers/roleController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/add', (0, authMiddleware_1.authorize)(['SUPER_ADMIN']), roleController_1.createRole);
router.get('/', (0, authMiddleware_1.authorize)(['SUPER_ADMIN', 'ADMIN']), roleController_1.getRoles);
// router.put('/:roleId', authorize(['SUPER_ADMIN']), updateRole);
// router.delete('/:roleId', authorize(['SUPER_ADMIN']), deleteRole);
exports.default = router;
