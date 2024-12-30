import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Account from '../models/Accounts';
import dotenv from 'dotenv';
import SessionsModel from '../models/Sessions';

dotenv.config();
const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;

const SALT_ROUNDS = 10; // Salt rounds for password hashing

// Controller to create a super admin
export const createSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new super admin account
    const newSuperAdmin = new Account({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleType: 'SUPER_ADMIN', // Explicitly set role type
    });

    await newSuperAdmin.save();

    // Generate JWT token

    if (!JWT_SECRET_KEY) {
      throw new Error(
        'JWT_SECRET is not configured in the environment variables',
      );
    }

    const token = jwt.sign(
      {
        id: newSuperAdmin._id,
        email: newSuperAdmin.email,
        role: newSuperAdmin.roleType,
      },
      JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

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
  } catch (error: any) {
    console.error('Error creating super admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create super admin account',
      error: error.message,
    });
  }
};

// Controller to handle user login
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: 'Please Enter Your Credentials',
      });
    }
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid Email or Password' });
    }

    // Create session record
    const session = new SessionsModel({
      admin_id: account._id,
      user_id: account._id,
      ip_address: req.ip, // Record the IP address
      user_agent: req.headers['user-agent'] || 'unknown', // Record the User-Agent
      device: req.headers['user-agent'] || 'unknown', // Record the device (can be updated based on requirement)
      login_timestamp: new Date(),
      last_active_timestamp: new Date(),
      status: 'active', // Set status to active
    });

    await session.save(); // Save the session to the database

    const token = jwt.sign(
      {
        id: account._id,
        email: account.email,
        role: account.roleType,
        sessionId: session._id, // Store session ID in the token
      },
      JWT_SECRET_KEY,
      { expiresIn: '1h' },
    );

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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error.message,
    });
  }
};

export const logoutSingleDevice = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const token = req.headers.authorization?.trim();
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Verify and decode the token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    } catch (err) {
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
    const session = await SessionsModel.findOneAndDelete({ _id: sessionId });

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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
      error: error.message,
    });
  }
};

export const logoutAllDevices = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { token } = req.body; // Token is needed to verify the user
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = (decodedToken as any).id; // Extract user ID from the decoded token

    // Find and delete all sessions for this user
    await SessionsModel.deleteMany({ user_id: userId });

    return res.status(200).json({
      success: true,
      message: 'Successfully logged out from all devices',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
      error: error.message,
    });
  }
};

// Controller to update an account
export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }
    const updatedAccount = await Account.findByIdAndUpdate(id, updateData, {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error Occured',
      error: error.message,
    });
  }
};

// Controller to delete an account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAccount = await Account.findByIdAndDelete(id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message,
    });
  }
};
