// src/controllers/employeeController.ts

import { Request, Response } from 'express';
import Employee from '../models/Employee';
import { ErrorResponse } from '../types';

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { branchId, name, role, email } = req.body;

    const newEmployee = new Employee({
      branchId,
      name,
      role,
      email,
      createdAt: new Date(),
    });

    await newEmployee.save();
    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to create employee', details: error.message });
  }
};

// Get employees for a branch
export const getEmployeesByBranch = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const employees = await Employee.find({ branchId });

    res.status(200).json(employees);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch employees', details: error.message });
  }
};
