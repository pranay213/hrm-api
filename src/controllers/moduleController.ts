import Module from '../models/Modules';
import { Request, Response } from 'express';

// Create a new module
export const createModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, icon, status } = req.body;

    // Validation
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Name is required',
      });
      return;
    }

    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      res.status(400).json({
        success: false,
        message: 'Module with this name already exists',
      });
      return;
    }

    const newModule = new Module({ name, icon, status });
    const savedModule = await newModule.save();
    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: savedModule,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create module',
      error: error.message,
    });
    return;
  }
};

// Get all modules
export const getModules = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const modules = await Module.find();
    res.status(200).json({
      success: true,
      message: 'Modules retrieved successfully',
      data: modules,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch modules',
      error: error.message,
    });
    return;
  }
};

// Get a single module by ID
export const getModuleById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Module ID is required',
      });
      return;
    }

    const module = await Module.findById(id);
    if (!module) {
      res.status(404).json({
        success: false,
        message: 'Module not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Module retrieved successfully',
      data: module,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module',
      error: error.message,
    });
    return;
  }
};

// Update a module by ID
export const updateModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, icon, status } = req.body;

    // Validation
    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Module ID is required',
      });
      return;
    }
    if (name) {
      const existingModule = await Module.findOne({ name, _id: { $ne: id } });
      if (existingModule) {
        res.status(400).json({
          success: false,
          message: 'Another module with this name already exists',
        });
        return;
      }
    }

    const updatedModule = await Module.findByIdAndUpdate(
      id,
      { name, icon, status },
      { new: true, runValidators: true },
    );

    if (!updatedModule) {
      res.status(404).json({
        success: false,
        message: 'Module not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: updatedModule,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update module',
      error: error.message,
    });
    return;
  }
};

// Delete a module by ID
export const deleteModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || id.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Module ID is required',
      });
      return;
    }

    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) {
      res.status(404).json({
        success: false,
        message: 'Module not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Module deleted successfully',
      data: deletedModule,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete module',
      error: error.message,
    });
    return;
  }
};
