import type { NextFunction, Request, Response } from "express";
import { getUserByAPIKey } from "../db/users_sql";
import { client } from "../db/client";
import { respondWithError } from "../json";
import { logger } from "../utils/logger";
import { AppError } from "../errors/CustomErrorBase"

// GetAPIKey extracts an API Key from
// the headers of an HTTP request
// example:
// Authorization: ApiKey {insert API key here}

export function getAPIKey(req: Request) {
  const authHeader = req.headers.authorization

  if (authHeader === "") return new AppError({ name: 'MISSING_AUTH', message: "No authorization info found" })

  const apiKey = authHeader?.split(' ')

  if (apiKey?.length !== 2) {
    return new AppError({ name: 'MALFORMED_AUTH', message: "Malformed auth header" })
  }

  if (apiKey.at(0) !== "ApiKey") {
    return new AppError({ name: 'MALFORMED_AUTH', message: "Malformed first part of the auth header" })
  }

  return apiKey.at(1) ?? new AppError({ name: 'UNEXPECTED_AUTH_ERROR', message: "An unexpected error occured while reading the api key'" })
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = getAPIKey(req)
  logger.info(apiKey)

  if (apiKey instanceof AppError) {
    return respondWithError(res, 400, `Auth error: ${apiKey.message}`)
  }

  const user = await getUserByAPIKey(client, { apiKey })
  logger.info('User from db:', user)

  if (user === null) return respondWithError(res, 400, 'Couldnt get user')
  req.user = user

  next();
};

export default authMiddleware
