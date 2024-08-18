import type { Request, Response } from "express";
import { createUser, getUserByAPIKey } from "../db/users_sql";
import { client } from "../db/client";
import { uuidv7 } from "uuidv7";
import { respondWithError, respondWithJSON } from "../json";
import { logger } from "../utils/logger";

export async function handlerCreateUser(req: Request, res: Response) {
  try {
    const { name } = req.body;
    logger.info(req.body);

    if (!name) {
      return respondWithError(res, 400, "Name is required!");
    }

    const result = await createUser(client, {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uuidv7(),
      name,
    });
    logger.info('Create user result:', result)

    if (!result) {
      return respondWithError(res, 500, "Couldn't create user");
    }

    return respondWithJSON(res, 200, { data: result });
  } catch (err) {
    logger.error('Error occured creating user', err)
    return res.status(500).json({ message: err });
  }
}

export async function handlerGetUserByAPIKey(_: Request, res: Response) {
  try {
    const apiKey = res.locals.user

    const result = await getUserByAPIKey(client, { apiKey })
    logger.info('Get user by API key result:', result)
    return respondWithJSON(res, 200, { data: result })
  } catch (err) {
    const errorMsg = "An error occured getting the users profile by api key"
    logger.error(errorMsg, err)
    return respondWithError(res, 500, errorMsg)
  }
}
