import { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from './constants';
import { v4 as uniqueId } from 'uuid';
import multer from 'multer';
import path from 'path';

dotenv.config();

// Define proper types for the file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Configure storage
export const STORAGE = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    return cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    return cb(null, `${uniqueId()}-${file.originalname}`);
  },
});

// Configure multer
export const upload = multer({
  storage: STORAGE,
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadImageToDb = async (
  req: Request & { file?: MulterFile },
  res: Response,
) => {
  try {
    // Check if file exists
    console.log('file', req);
    if (!req.file) {
      return {
        error: true,
        status: 400,
        message: 'No file uploaded',
      };
    }

    // Configure cloudinary
    cloudinary.config({
      ...CLOUDINARY_CONFIG,
    });

    // Upload to cloudinary
    const uploadImage = await cloudinary.uploader.upload(req.file.path, {
      public_id: uniqueId(),
      resource_type: 'image',
      upload_preset: process.env.COMPANY_UPLOAD_PRESET,
    });

    // Clean up local file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!uploadImage?.public_id) {
      return {
        error: true,
        status: 500,
        message: 'Failed to upload image to cloud storage',
      };
    }

    return {
      error: false,
      data: uploadImage,
    };
  } catch (error: any) {
    // Clean up local file in case of error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return {
      error: true,
      status: 500,
      message: error.message || 'Something went wrong while uploading image',
    };
  }
};
