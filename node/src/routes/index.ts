// Project dependencies
import { healthRouter } from "./health";
import { usersRouter } from "./users";
import { feedsRouter } from "./feeds";
import { feedFollowsRouter } from "./feed_follows";
import { errorHandler } from "../middleware/error";
import { Router } from "express";

const v1Router = Router()

// Routes
v1Router.use('/users', usersRouter);
v1Router.use('/feeds', feedsRouter);
v1Router.use('/feed', feedsRouter);
v1Router.use('/feed_follows', feedFollowsRouter);
v1Router.use('/health', healthRouter);

// 404 Route
// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: `Can't find ${req.originalUrl} this route`,
//   });
// });
// Error handling

v1Router.use(errorHandler);

export { v1Router }