import Parser from "rss-parser";
import { HttpError } from "./errors/";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSChannel = {
  title: string;
  link: string;
  description: string;
  language: string;
  items: RSSItem[];
  item: RSSItem;
};

export type RSSFeed = {
  rss: { channel: RSSChannel };
};

const parser: Parser<RSSChannel, RSSItem> = new Parser({
  customFields: {
    feed: ["description", "item", "language", "link", "title"],
    item: ["description", "link", "pubDate", "title"],
  },
});

export async function urlToFeed(url: string) {
  try {
    return await parser.parseURL(url);
  } catch (err) {
    throw new HttpError({
      message: `An error occured while parsing the feed url: ${url}`,
      name: "ERROR_PARSING_XML",
      cause: err,
    });
  }
}
