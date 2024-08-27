import z from 'zod';
import dotenv from "dotenv";
import { logger } from './utils/logger';

dotenv.config({ path: "../.env" });

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_PORT: z.string().trim(),
});

const parsedVars = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_PORT: process.env.NODE_PORT,
});

logger.info(parsedVars)
export default parsedVars
