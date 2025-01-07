import { Request, Response } from 'express';
import Company from '../models/Company';
import multer from 'multer';
import Account from '../models/Accounts';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { uploadImageToDb } from '../utils/multer';
import Role from '../models/Role';

dotenv.config();
const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;
const SALT_ROUNDS = 10; // Salt rounds for password hashing

// Error Type
interface CustomError extends Error {
  message: string;
}

// Create a new company

export const uploadImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await uploadImageToDb(req, res);

    if (result.error) {
      res.status(result.status || 500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

export const createCompany = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, email, address, password, permissions, logo } = req.body; // Extract permissions string

    // console.log('Uploaded file:', req.file, permissions); // Check the uploaded file

    // Validate required fields
    if (!name || !email || !address || !password || !logo || !permissions) {
      res.status(400).json({
        success: false,
        message: 'All fields and a logo file are required',
      });
      return;
    }
    const createdBy = req.user.id;
    // Check for existing company or account
    const existingCompany = await Company.findOne({ name });
    const existingAccount = await Account.findOne({ email });

    if (existingCompany || existingAccount) {
      res.status(400).json({
        success: false,
        message: 'Company with this name or email already exists',
      });
      return;
    }

    // Creating Account
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const roleId = await Role.findOne({ name: 'COMPANY' }).select('_id');

    const newAccount = new Account({
      firstName: name,
      lastName: ' ',
      email,
      password: hashedPassword,
      roleType: roleId, // Explicitly set role type
    });

    const createdAccount = await newAccount.save();
    if (!createdAccount) {
      res.status(400).json({
        success: false,
        message: 'Account creation failed',
      });
      return;
    }

    // Create the company
    const company = new Company({
      name,
      email,
      address,
      createdBy: req.user.id,
      accountId: newAccount._id,
      permissions, // Assign permissions array
      logo: logo, // Save Cloudinary URL
    });

    const newCompany = await company.save();
    if (!newCompany) {
      res.status(400).json({
        success: false,
        message: 'Company creation failed',
      });
      return;
    }

    // Create a new super admin account

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company: newCompany, account: createdAccount },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message,
    });
  }
};

// Get all companies
export const getAllCompanies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      message: 'Companies fetched successfully',
      data: companies,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: typedError.message,
    });
    return;
  }
};

// Get a single company by ID
export const getCompanyById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const company: any = await Company.findById(id)
      .populate('accountId', 'email')
      .lean();

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Company fetched successfully',
      data: {
        ...company,
        email: company.accountId?.email,
      },
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: typedError.message,
    });
    return;
  }
};

// Update a company by ID
export const updateCompany = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCompany) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error updating company',
      error: typedError.message,
    });
    return;
  }
};

// Delete (deactivate) a company by ID
export const deactivateCompany = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deactivatedCompany = await Company.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!deactivatedCompany) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Company deactivated successfully',
      data: deactivatedCompany,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error deactivating company',
      error: typedError.message,
    });
    return;
  }
};
