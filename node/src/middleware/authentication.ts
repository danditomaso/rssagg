import type { NextFunction, Request, Response } from "express";
import { getUserByAPIKey } from "../db/users_sql";
import { client } from "../db/client";
import { respondWithError } from "../json";
import { getAPIKey } from "../db/auth";
import { AppError } from "../errors/CustomErrorBase";
import { logger } from "../utils/logger";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = getAPIKey(req)
  logger.info(apiKey)

  if (apiKey instanceof AppError) {
    return respondWithError(res, 400, `Auth error: ${apiKey.message}`)
  }

  const user = await getUserByAPIKey(client, { apiKey })
  logger.info(user)

  if (user === null) return respondWithError(res, 400, 'Couldnt get user')
  res.locals.user = apiKey

  next();
};
export default authMiddleware