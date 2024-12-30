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
    if (!name || !backendPath || !frontEndPath) {
      res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
      return;
    }
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

export const updateModule = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const { name, backendPath, frontEndPath, parentId, metadata, status } =
      req.body;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Module Id Not Found',
      });
      return;
    }

    const findModule = await Module.findById(id);
    if (!findModule) {
      res.status(404).json({
        success: false,
        message: 'Module Not Found',
      });
    }

    await Module.findByIdAndUpdate(
      id,
      { name, frontEndPath, backendPath, parent: parentId, metadata, status },
      {
        new: true,
      },
    );
    res.status(200).json({
      success: true,
      message: 'Module updated Successfully',
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
  let mongoQuery: any;
  if (parentId) mongoQuery.parent = parentId;
  const modules = await Module.find(mongoQuery).lean();

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
    // Helper function to recursively build the module hierarchy
    const buildHierarchy = async (
      parentId: string | null = null,
    ): Promise<any> => {
      const modules = await Module.find({ parent: parentId }).lean(); // Fetch modules with the specified parent
      return Promise.all(
        modules.map(async (module: any) => ({
          ...module,
          children: await buildHierarchy(module._id), // Recursively fetch children
        })),
      );
    };

    // Build the hierarchy starting from the root modules (parent = null)
    const hierarchy = await buildHierarchy(null);

    res.status(200).json({
      success: true,
      message: 'Fetched modules successfully',
      data: hierarchy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Fetching modules failed',
      error: error.message,
    });
  }
};

// Get a specific module by name
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const module = await Module.findById(id);
    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: 'Module not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Module Retrieved', data: module });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch module',
      error: error.message,
    });
  }
};
