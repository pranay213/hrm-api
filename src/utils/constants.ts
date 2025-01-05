import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI: any = process.env?.DEV_MODE
  ? process.env.DEV_MONGO_URL
  : process.env.PROD_MONGO_URL;

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const SUPER_ADMIN = 'SUPER_ADMIN';
