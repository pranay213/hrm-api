"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountsController_1 = require("../controllers/accountsController");
const router = express_1.default.Router();
// Route for login
router.post('/login', accountsController_1.login); // Login route
// // Route for creating a super admin
router.post('/create-super-admin', accountsController_1.createSuperAdmin); // Create super admin route
// // Route for updating an account
// router.put('/update/:id', updateAccount); // Update account route
// // Route for deleting an account
// router.delete('/delete/:id', deleteAccount); // Delete account route
exports.default = router;
