import Module from '../models/Modules';
import { Request, Response } from 'express';
// Adjust the path to your Module model

// Create a new module
// Create a new module
export const createModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, backendPath, frontEndPath, parentId, metadata } = req.body;
    const newModule = new Module({
      name,
      backendPath,
      frontEndPath,
      parent: parentId || null,
      metadata: metadata || {},
    });

    const savedModule = await newModule.save();

    // Update the parent's children array if a parentId is provided
    if (parentId) {
      await Module.findByIdAndUpdate(parentId, {
        $push: { children: savedModule._id },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Module created Successfully',
      data: savedModule,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Module creation failed',
      error: error.message,
    });
  }
};

// Get all modules
// Helper function to recursively build the module hierarchy
const buildHierarchy = async (parentId: string | null = null): Promise<any> => {
  const modules = await Module.find({ parent: parentId }).lean();

  return Promise.all(
    modules.map(async (module: any) => ({
      ...module,
      children: await buildHierarchy(module._id), // Recursively fetch children
    })),
  );
};

// Retrieve all modules in a nested structure
export const getAllModules = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const hierarchy = await buildHierarchy();
    res.status(200).json({
      succees: true,
      message: 'feched modules successfully',
      data: hierarchy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'fetching modules Failed',
      error: error.message,
    });
  }
};

// Get a specific module by name
export const getModuleByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const module = await Module.findOne({ name });
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: 'Module not found' });
    }
    res.status(200).json({ module });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module',
      error: error.message,
    });
  }
};
