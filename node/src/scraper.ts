import type { Pool } from "pg";
import { logger } from "./utils/logger";
import {
  getNextFeedsToFetch,
  markFeedAsFetched,
} from "./db/feeds_sql";
import type { Feed } from './types/Feed'
import { AppError, DatabaseError, HttpError } from "./errors/";
import { urlToFeed, type RSSItem } from "./rss";
import { isFulfilled, isRejected } from "./utils/promise";
import { createPost } from "./db/posts_sql";
import { client } from "./db/client";
import { uuidv7 } from "uuidv7";

const timeBetweenRequestsMap = {
  "30seconds": 30000,
  "1minute": 60000,
  "2minutes": 120000,
  "5minutes": 300000,
  "10minutes": 600000,
};
type ScraperProps = {
  client: Pool;
  limit: number;
  timeBetweenRequests: keyof typeof timeBetweenRequestsMap;
};
export async function startScraping({
  client,
  limit,
  timeBetweenRequests,
}: ScraperProps) {
  // make sure the value passed in is valid or else throw an error
  if (
    !Object.keys(timeBetweenRequestsMap).find(
      (val) => val === timeBetweenRequests,
    )
  ) {
    throw new AppError({
      name: "BAD_PARAM",
      message: "invalid parameter passed to start scraping function",
    });
  }

  logger.info(`Scraping ${limit} items every ${timeBetweenRequests}`);

  const counter = setInterval(async () => {
    const feedsToFetch = await getNextFeedsToFetch(client, { limit: "10" });
    logger.info('all feeds to scrap', feedsToFetch)

    for (const feed of feedsToFetch) {
      scrapeFeed(feed);
    }

  }, timeBetweenRequestsMap[timeBetweenRequests]);
}

async function scrapeFeed(feed: Feed) {
  try {
    urlToFeed(feed?.url).then((rssFeed) => {
      logger.debug(
        `Feed ${rssFeed.title} collected, ${rssFeed.items.length} posts found.`,
      );

      for (const item of rssFeed.items) {
        createPost(client, {
          createdAt: new Date(),
          updatedAt: new Date(),
          title: item.title,
          description: item.description,
          publishedAt: new Date(item.pubDate),
          url: item.link,
          id: uuidv7(),
          feedId: feed.id,
        });
      }
    });
    // const fulfilledValues = (await Promise.allSettled(feedPromises)).filter(isFulfilled).map(p => p.value)
  } catch (err) {
    throw new HttpError({
      name: "ERROR_PARSING_XML",
      message: "an occured occured trying to fetch the rss feeds",
    });
  }
}
