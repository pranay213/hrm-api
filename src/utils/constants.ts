export const MONGO_URI: any = process.env?.DEV_MODE
  ? process.env.DEV_MONGO_URL
  : process.env.PROD_MONGO_URL;
