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
exports.deleteAccount = exports.updateAccount = exports.login = exports.createSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Accounts_1 = __importDefault(require("../models/Accounts"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const SALT_ROUNDS = 10; // Salt rounds for password hashing
// Controller to create a super admin
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Validate input fields
        if (!firstName || !lastName || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'All fields are required' });
        }
        // Check if the email already exists
        const existingAccount = yield Accounts_1.default.findOne({ email });
        if (existingAccount) {
            return res
                .status(400)
                .json({ success: false, message: 'Email already in use' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        // Create a new super admin account
        const newSuperAdmin = new Accounts_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roleType: 'SUPER_ADMIN', // Explicitly set role type
        });
        yield newSuperAdmin.save();
        // Generate JWT token
        if (!JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET is not configured in the environment variables');
        }
        const token = jsonwebtoken_1.default.sign({
            id: newSuperAdmin._id,
            email: newSuperAdmin.email,
            role: newSuperAdmin.roleType,
        }, JWT_SECRET_KEY, { expiresIn: '1h' });
        // Respond with the created account and token
        res.status(201).json({
            success: true,
            message: 'Super Admin account created successfully',
            account: {
                id: newSuperAdmin._id,
                firstName: newSuperAdmin.firstName,
                lastName: newSuperAdmin.lastName,
                email: newSuperAdmin.email,
                roleType: newSuperAdmin.roleType,
            },
            token,
        });
    }
    catch (error) {
        console.error('Error creating super admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create super admin account',
            error: error.message,
        });
    }
});
exports.createSuperAdmin = createSuperAdmin;
// Controller to handle user login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: 'Please Enter Your Credentials',
            });
        }
        const account = yield Accounts_1.default.findOne({ email });
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found',
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, account.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: 'Invalid Email or Password' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: account._id,
            email: account.email,
            role: account.roleType,
        }, JWT_SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                account: {
                    id: account._id,
                    email: account.email,
                    firstName: account.firstName,
                    lastName: account.lastName,
                    roleType: account.roleType,
                },
                token,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login',
            error: error.message,
        });
    }
});
exports.login = login;
// Controller to update an account
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Hash password if it's being updated
        if (updateData.password) {
            updateData.password = yield bcrypt_1.default.hash(updateData.password, SALT_ROUNDS);
        }
        const updatedAccount = yield Accounts_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedAccount) {
            return res
                .status(404)
                .json({ success: true, message: 'Account not found' });
        }
        res.status(200).json({
            message: 'Account updated successfully',
            account: updatedAccount,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error Occured',
            error: error.message,
        });
    }
});
exports.updateAccount = updateAccount;
// Controller to delete an account
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedAccount = yield Accounts_1.default.findByIdAndDelete(id);
        if (!deletedAccount) {
            return res
                .status(404)
                .json({ success: false, message: 'Account not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
            account: deletedAccount,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message,
        });
    }
});
exports.deleteAccount = deleteAccount;
