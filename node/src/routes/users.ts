import { Router } from "express";
import { handlerCreateUser, handlerGetPostsForUser, handlerGetUserByAPIKey } from "../controllers/handler_users";
import requireAuth from "../middleware/auth";

const usersRouter = Router();

usersRouter.post("/", handlerCreateUser);
usersRouter.get("/", requireAuth, handlerGetUserByAPIKey);
usersRouter.get("/posts", requireAuth, handlerGetPostsForUser);

export { usersRouter };