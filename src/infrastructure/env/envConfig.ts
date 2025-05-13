import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;   
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SECRET_KEY = process.env.SECRET_KEY;
export const SESSION_SECRET = process.env.SESSION_SECRET;