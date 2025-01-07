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
exports.deleteAccount = exports.updateAccount = exports.logoutAllDevices = exports.logoutSingleDevice = exports.login = exports.createAccount = exports.createSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Accounts_1 = __importDefault(require("../models/Accounts"));
const dotenv_1 = __importDefault(require("dotenv"));
const Sessions_1 = __importDefault(require("../models/Sessions"));
const Role_1 = __importDefault(require("../models/Role"));
const Modules_1 = __importDefault(require("../models/Modules"));
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
        const roleId = yield Role_1.default.findOne({ name: 'SUPER_ADMIN' }).select('_id');
        const modules = yield Modules_1.default.find({}).select('_id name');
        console.log('modules', modules);
        const newSuperAdmin = new Accounts_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            roleType: roleId, // Explicitly set role type
            permissions: modules,
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
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Validate input fields
        if (!firstName || !email || !password) {
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
exports.createAccount = createAccount;
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
        // Create session record
        const session = new Sessions_1.default({
            admin_id: account._id,
            user_id: account._id,
            ip_address: req.ip, // Record the IP address
            user_agent: req.headers['user-agent'] || 'unknown', // Record the User-Agent
            device: req.headers['user-agent'] || 'unknown', // Record the device (can be updated based on requirement)
            login_timestamp: new Date(),
            last_active_timestamp: new Date(),
            status: 'active', // Set status to active
        });
        yield session.save(); // Save the session to the database
        const allPermissions = yield Modules_1.default.find({
            _id: { $in: account.permissions }, // Convert to ObjectId if IDs are in ObjectId format
        });
        const filterPermissions = allPermissions.map((each) => {
            return {
                _id: each._id,
                name: each.name,
                status: each === null || each === void 0 ? void 0 : each.status,
            };
        });
        const roleType = yield Role_1.default.findById(account.roleType);
        console.log('roleType-----', roleType);
        const token = jsonwebtoken_1.default.sign({
            id: account._id,
            email: account.email,
            role: account.roleType,
            sessionId: session._id, // Store session ID in the token
            permissions: filterPermissions,
        }, JWT_SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                account: {
                    id: account._id,
                    email: account.email,
                    firstName: account.firstName,
                    lastName: account.lastName,
                    roleType: roleType === null || roleType === void 0 ? void 0 : roleType.name,
                    permissions: filterPermissions,
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
const logoutSingleDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim();
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
            });
        }
        // Verify and decode the token
        let decodedToken;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
        const { sessionId } = decodedToken; // Extract sessionId from decoded token
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID not found in token',
            });
        }
        // Find and delete the session associated with the session ID
        const session = yield Sessions_1.default.findOneAndDelete({ _id: sessionId });
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'No session found for the given session ID',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully logged out from this device',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred during logout',
            error: error.message,
        });
    }
});
exports.logoutSingleDevice = logoutSingleDevice;
const logoutAllDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body; // Token is needed to verify the user
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
            });
        }
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        const userId = decodedToken.id; // Extract user ID from the decoded token
        // Find and delete all sessions for this user
        yield Sessions_1.default.deleteMany({ user_id: userId });
        return res.status(200).json({
            success: true,
            message: 'Successfully logged out from all devices',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred during logout',
            error: error.message,
        });
    }
});
exports.logoutAllDevices = logoutAllDevices;
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
