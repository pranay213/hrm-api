"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to authenticate requests using JWT
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim(); // Extract Authorization header
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token format.',
        });
        return; // Exit if token is not properly formatted
    }
    try {
        const secret = process.env.JWT_SECRET_KEY; // Ensure the secret is set
        if (!secret) {
            throw new Error('JWT secret key is not configured.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret); // Decode and cast to JwtUserPayload
        req.user = decoded; // Attach the decoded payload to the request
        next(); // Pass control to the next middleware
    }
    catch (err) {
        console.error('Token verification failed:', err);
        res
            .status(400)
            .json({ success: false, message: 'Invalid Token', error: err.message });
    }
};
exports.authenticate = authenticate;
// Middleware to authorize requests based on roles
const authorize = (roles) => {
    return (req, res, next) => {
        console.log('user---', req.user);
        if (!req.user || !roles.includes(req.user.role)) {
            res
                .status(403)
                .json({ success: false, message: 'Access denied. No token provided.' });
            return; // Ensure the function exits after sending the response
        }
        next(); // User has the required role, proceed
    };
};
exports.authorize = authorize;
