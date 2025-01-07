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
exports.authorize = exports.authenticate = void 0;
const Modules_1 = __importDefault(require("../models/Modules"));
const Accounts_1 = __importDefault(require("../models/Accounts"));
const sessions_1 = require("../utils/sessions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim();
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token.',
            sessionExpired: true,
        });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) {
            throw new Error('JWT secret key is not configured.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        const findUser = yield Accounts_1.default.findOne({ _id: req.user.id });
        const findModules = yield Modules_1.default.find({
            _id: {
                $in: findUser === null || findUser === void 0 ? void 0 : findUser.permissions,
            },
        }, {
            name: 1,
            _id: 0,
        });
        const dbPermissions = findModules.map((each) => each === null || each === void 0 ? void 0 : each.name);
        // Check if the user has access to the requested route
        const requestedModule = (_b = req.baseUrl.split('/')[2]) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        console.log('requestredRoute', requestedModule);
        console.log('userPermissions', dbPermissions);
        if (!requestedModule || !dbPermissions.includes(requestedModule)) {
            res.status(403).json({
                success: false,
                message: 'you are not access to this route',
                redirect: true,
            });
            return;
        }
        yield (0, sessions_1.loginVerify)(req, res, next);
    }
    catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).json({
            success: false,
            message: 'Invalid Token',
            error: err.message,
            sessionExpired: true,
        });
    }
});
exports.authenticate = authenticate;
// Middleware to authorize requests based on roles
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied. You are unable to access this resource.',
            });
            return; // Ensure the function exits after sending the response
        }
        next(); // User has the required role, proceed
    };
};
exports.authorize = authorize;
