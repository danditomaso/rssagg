import type { Request, Response } from "express";
import { client } from "../db/client";
import { uuidv7 } from "uuidv7";
import { respondWithError, respondWithJSON } from "../json";
import { logger } from "../utils/logger";
import { createFeed, getFeeds } from "../db/feeds_sql";

export async function handlerCreateFeed(req: Request, res: Response) {
  try {
    const { name, url } = req.body;
    logger.info(req.body);

    const user = req.user

    if (!name) {
      return respondWithError(res, 400, "name property is required!");
    }
    if (!url) {
      return respondWithError(res, 400, "url property is required!");
    }

    const result = await createFeed(client, {
      createdAt: new Date(),
      updatedAt: new Date(),
      name,
      url,
      id: uuidv7(),
      userId: user?.id
    });

    if (!result) {
      return respondWithError(res, 500, "Couldn't create feed");
    }

    return respondWithJSON(res, 200, { data: result });
  } catch (err) {
    logger.error('Error occured creating feed', err)
    return res.status(500).json({ message: err });
  }
}

export async function handlerGetAllFeeds(_: Request, res: Response) {
  const result = await getFeeds(client)
  logger.info(result);

  if (!result) {
    return respondWithError(res, 500, "Couldn't retrieve feeds")
  }

  return respondWithJSON(res, 200, { data: result })
}