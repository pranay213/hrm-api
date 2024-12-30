import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import companyRoutes from './routes/companyRoutes'; // Company routes
import branchRoutes from './routes/branchRoutes'; // Branch routes
import employeeRoutes from './routes/employeeRoutes'; // Employee routes
import roleRoutes from './routes/roleRoutes'; //Role routes
import moduleRoutes from './routes/moduleRouter'; //Role routes
import accountRoutes from './routes/accountRoutes'; //account routes
import { createSuperAdmin } from './controllers/accountsController';
import connectDB from './config/database'; // Import database configuration
import { authenticate } from './middlewares/authMiddleware';
import logger from './utils/logger';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();
// Connect to the database
connectDB();
// Import Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
app.use((req, res, next) => {
  const { method, url, headers, body } = req;
  const startTime: any = new Date();

  logger.info(
    `Request: ${method} ${url} - Headers: ${headers.Authorization} -Body: ${JSON.stringify(body)}`,
  );

  // Capture response details
  const originalSend = res.send;
  res.send = function (body) {
    return originalSend.call(this, body);
  };

  next();
});
// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
app.get('/api/initialize', async (req, res) => {
  try {
    // Provide default super admin data
    req.body = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: 'admin',
    };
    // Call the createSuperAdmin controller
    await createSuperAdmin(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize super admin',
      error: error.message,
    });
  }
});
// Role Route
app.use('/api/', accountRoutes); // Uncomment and add roleRoutes for role management
app.use('/api/module', authenticate, moduleRoutes); // Uncomment and add roleRoutes for role management

app.use('/api/role', authenticate, roleRoutes); // Uncomment and add roleRoutes for role management
// Secured Routes
// app.use('/api/companies', authenticate, companyRoutes); // Routes for companies
// app.use('/api/branches', authenticate, branchRoutes); // Routes for branches
// app.use('/api/employees', authenticate, employeeRoutes); // Routes for employees

export default app;
