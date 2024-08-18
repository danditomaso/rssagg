import express from "express";
import { handlerCreateFeed, handlerGetAllFeeds } from "../controllers/handler_feeds";
import requireAuth from "../middleware/auth";

const feedsRouter = express.Router();

feedsRouter.post("/", requireAuth, handlerCreateFeed);
feedsRouter.get("/", handlerGetAllFeeds);

export { feedsRouter };