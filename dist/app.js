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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes")); // Company routes
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes")); //Role routes
const moduleRouter_1 = __importDefault(require("./routes/moduleRouter")); //Role routes
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes")); //account routes
const accountsController_1 = require("./controllers/accountsController");
const database_1 = __importDefault(require("./config/database")); // Import database configuration
const authMiddleware_1 = require("./middlewares/authMiddleware");
const logger_1 = __importDefault(require("./utils/logger"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables from .env file
dotenv_1.default.config();
// Connect to the database
(0, database_1.default)();
// Import Swagger documentation
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Middleware to parse JSON bodies
app.use(express_1.default.json());
app.use((req, res, next) => {
    const { method, url, headers, body } = req;
    const startTime = new Date();
    logger_1.default.info(`Request: ${method} ${url} - Headers: ${headers.authorization} -Body: ${JSON.stringify(body)}`);
    // Capture response details
    const originalSend = res.send;
    res.send = function (body) {
        return originalSend.call(this, body);
    };
    next();
});
// Serve Swagger API documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Root route
app.get('/', (req, res) => {
    res.send({ message: 'Server is running' });
});
// API status route
app.get('/api', (req, res) => {
    res.status(200).send({
        success: true,
        message: `Your API is running at http://localhost:${process.env.PORT}`,
    });
});
// Initialize Super Admin Route
app.get('/api/initialize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Provide default super admin data
        req.body = {
            firstName: 'Pranay',
            lastName: 'Kodam',
            email: 'pranay@kodam.in',
            password: 'test',
        };
        // Call the createSuperAdmin controller
        yield (0, accountsController_1.createSuperAdmin)(req, res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to initialize super admin',
            error: error.message,
        });
    }
}));
// Role Route
app.use('/api/', accountRoutes_1.default); // Uncomment and add roleRoutes for role management
app.use('/api/module', authMiddleware_1.authenticate, moduleRouter_1.default); // Uncomment and add roleRoutes for role management
app.use('/api/role', authMiddleware_1.authenticate, roleRoutes_1.default); // Uncomment and add roleRoutes for role management
// Secured Routes
app.use('/api/company', authMiddleware_1.authenticate, companyRoutes_1.default); // Routes for companies
// app.use('/api/branches', authenticate, branchRoutes); // Routes for branches
// app.use('/api/employees', authenticate, employeeRoutes); // Routes for employees
exports.default = app;
