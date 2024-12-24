import { Request, Response } from 'express';
import Role from '../models/Role'; // Assuming the Role model is in models/Role
import Module from '../models/Modules';

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, checkedModules } = req.body;

    // Validate input
    if (!name || !Array.isArray(checkedModules)) {
      return res.status(400).json({
        error: 'Invalid input data. Name and checkedModules are required.',
      });
    }

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res
        .status(409)
        .json({ error: 'Role with the same name already exists' });
    }

    // Get all modules
    const allModules = await Module.find();

    // Create permissions object: true for checkedModules, false for others
    const permissions = allModules.map((module: any) => ({
      module: module._id,
      permission: checkedModules.includes(module._id.toString()),
    }));

    // Create and save the role
    const newRole = await Role.create({ name, permissions });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message,
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const findRoles = await Role.find();
    res.status(200).send({
      success: true,
      message: 'roles fetched',
      data: findRoles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
