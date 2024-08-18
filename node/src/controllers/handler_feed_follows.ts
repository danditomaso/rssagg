import type { Request, Response } from "express";
import { client } from "../db/client";
import { uuidv7 } from "uuidv7";
import { respondWithError, respondWithJSON } from "../json";
import { logger } from "../utils/logger";
import { createFeed, getFeeds } from "../db/feeds_sql";
import { createFeedFollow, deleteFeedFollow } from "../db/feed_follows_sql";

export async function handlerCreateFeedFollow(req: Request, res: Response) {
  try {
    const { feed_id } = req.body;
    logger.info(req.body);

    const user = req.user

    console.log('user', user);

    if (!feed_id) {
      return respondWithError(res, 400, "feed_id property is required!");
    }

    const result = await createFeedFollow(client, {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uuidv7(),
      feedId: feed_id,
      userId: user?.id
    });

    if (!result) {
      return respondWithError(res, 500, "Couldn't create feed follow");
    }

    return respondWithJSON(res, 200, { data: result });
  } catch (err) {
    logger.error('Error occured creating feed follow', err)
    return res.status(500).json({ message: err });
  }
}

export async function handlerGetFeedFollows(_: Request, res: Response) {
  const result = await getFeeds(client)
  logger.info(result);

  if (!result) {
    return respondWithError(res, 500, "Couldn't retrieve feed follows")
  }

  return respondWithJSON(res, 200, { data: result })
}

export async function handlerDeleteFeedFollows(req: Request, res: Response) {
  try {
    const { feedFollowId } = req.params;
    logger.info(req.params);

    const user = req.user

    console.log('user', user);

    if (!feedFollowId) {
      return respondWithError(res, 400, "feedFollowId property is required!");
    }

    await deleteFeedFollow(client, {
      id: feedFollowId,
      userId: user.id
    });

    return respondWithJSON(res, 200, { data: null });
  } catch (err) {
    logger.error('Error occured creating feed follow', err)
    return res.status(500).json({ message: err });
  }
}