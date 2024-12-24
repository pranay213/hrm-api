// src/controllers/branchController.ts

import { Request, Response } from 'express';
import Branch from '../models/Branch';

// Create a new branch
export const createBranch = async (req: Request, res: Response) => {
  try {
    const { companyId, name } = req.body;

    const newBranch = new Branch({
      companyId,
      name,
      createdAt: new Date(),
    });

    await newBranch.save();
    res
      .status(201)
      .json({ message: 'Branch created successfully', branch: newBranch });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to create branch', details: error.message });
  }
};

// Get all branches for a company
export const getBranchesByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const branches = await Branch.find({ companyId });

    res.status(200).json(branches);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch branches', details: error.message });
  }
};
