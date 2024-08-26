import type { Pool } from "pg";
import { logger } from "./utils/logger";
import { getNextFeedsToFetch, markFeedAsFetched } from "./db/feeds_sql";
import type { Feed } from "./types/Feed";
import { AppError, HttpError } from "./errors/";
import { urlToFeed } from "./rss";
import { createPost } from "./db/posts_sql";
import { client } from "./db/client";
import { uuidv7 } from "uuidv7";

const timeBetweenRequestsMap = {
  "30seconds": 30000,
  "1minute": 60000,
  "2minutes": 120000,
  "5minutes": 300000,
  "10minutes": 600000,
  "30minutes": 1800000,
  "4hours": 14400000,
  "24hours": 86400000,
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
  // make sure the value passed matches one of our "X minutes" props or else throw an error
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

  setInterval(async () => {
    // grab all feeds from database
    const feedsToFetch = await getNextFeedsToFetch(client, { limit: "10" });
    logger.info("Feeds to scrap", feedsToFetch);

    // create a promise for each feed
    const feedPromises = feedsToFetch.map((feed) => scrapeFeed(feed));

    // resolve all promises at same time,  using allSettled ensures the all promises will be resolved, 
    // then can be handled  if they resolved or rejected 
    (await Promise.allSettled(feedPromises))
    // .filter(isFulfilled)
    // .map((p) => p.value);

  }, timeBetweenRequestsMap[timeBetweenRequests]);
}

async function scrapeFeed(feed: Feed) {
  try {
    const rssFeed = await urlToFeed(feed.url)

    logger.debug(
      `Feed ${rssFeed.title} collected, ${rssFeed.items.length} posts found.`)

    // for each item in a feed, add it to the database
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
  } catch (err) {
    throw new HttpError({
      name: "ERROR_PARSING_XML",
      message: "an occured occured trying to fetch the rss feeds",
    });
  } finally {
    // mark each feed as having been fetched
    markFeedAsFetched(client, { id: feed.id })

  }
}