import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;