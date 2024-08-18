import { Router } from "express";
import { handlerCreateUser, handlerGetUserByAPIKey } from "../controllers/handler_users";
import requireAuth from "../middleware/auth";

const usersRouter = Router();

usersRouter.post("/", handlerCreateUser);
usersRouter.get("/", requireAuth, handlerGetUserByAPIKey);

export { usersRouter };