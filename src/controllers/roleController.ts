import { Request, Response } from 'express';
import Role from '../models/Role';

// Error Type
interface CustomError extends Error {
  message: string;
}

// Create a new role
export const createRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, isActive } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      res.status(400).json({
        success: false,
        message: 'Role with this name already exists',
      });
      return;
    }

    const role = new Role({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    await role.save();
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: typedError.message,
    });
    return;
  }
};

// Get all roles
export const getAllRoles = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      success: true,
      message: 'Roles fetched successfully',
      data: roles,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: typedError.message,
    });
    return;
  }
};

// Get a single role by ID
export const getRoleById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Role fetched successfully',
      data: role,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: typedError.message,
    });
    return;
  }
};

// Update a role by ID
export const updateRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRole = await Role.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedRole) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: typedError.message,
    });
    return;
  }
};

// Delete (deactivate) a role by ID
export const deactivateRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deactivatedRole = await Role.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!deactivatedRole) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Role deactivated successfully',
      data: deactivatedRole,
    });
    return;
  } catch (error) {
    const typedError = error as CustomError;
    res.status(500).json({
      success: false,
      message: 'Error deactivating role',
      error: typedError.message,
    });
    return;
  }
};
