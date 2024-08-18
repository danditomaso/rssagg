import express, { type Request, type Response, Router } from "express";

const healthRouter = express.Router();

async function handlerReadiness(_: Request, res: Response) {
  try {
    return res.status(200).json("Healthy");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

healthRouter.get("/", handlerReadiness);

export { healthRouter };