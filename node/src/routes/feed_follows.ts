import express from "express";
import { handlerCreateFeedFollow, handlerDeleteFeedFollows, handlerGetFeedFollows } from "../controllers/handler_feed_follows";
import requireAuth from "../middleware/auth";

const feedFollowsRouter = express.Router();

feedFollowsRouter.post("/", requireAuth, handlerCreateFeedFollow);
feedFollowsRouter.get("/", handlerGetFeedFollows);
feedFollowsRouter.delete("/:feedFollowId", handlerDeleteFeedFollows);

export { feedFollowsRouter };