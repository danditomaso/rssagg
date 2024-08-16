import { Router } from "express";
import { handlerCreateUser, handlerGetUserByAPIKey } from "../controllers/handler_users";
import authentication from "../middleware/authentication";

const router = Router();

router.post("/users", handlerCreateUser);
router.get("/users", authentication, handlerGetUserByAPIKey);

export default router;