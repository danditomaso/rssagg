import z from 'zod';
import dotenv from "dotenv";
import { logger } from './utils/logger';

dotenv.config({ path: "../.env" });

const envSchema = z.object({
  NODE_DB_URI: z.string(),
  NODE_PORT: z.string().trim(),
});

const parsedVars = envSchema.parse({
  NODE_DB_URI: process.env.NODE_DB_URI,
  NODE_PORT: process.env.NODE_PORT,
});

logger.info(parsedVars)
export default parsedVars
