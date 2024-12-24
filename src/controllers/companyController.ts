// src/controllers/companyController.ts

import { Request, Response } from 'express';
import Company from '../models/Company';

// Create a new company
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, accountType } = req.body;

    // Create a new company in the database
    const newCompany = new Company({
      name,
      accountType,
      createdAt: new Date(),
    });

    await newCompany.save();
    res
      .status(201)
      .json({ message: 'Company created successfully', company: newCompany });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to create company', details: error.message });
  }
};

// Get all companies
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch companies', details: error.message });
  }
};

// Get a specific company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch company', details: error.message });
  }
};

// Update a company
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Company updated successfully',
      company: updatedCompany,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to update company', details: error.message });
  }
};

// Delete a company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to delete company', details: error.message });
  }
};
