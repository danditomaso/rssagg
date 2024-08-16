/** src/middlewares/errors.ts **/
import type { NextFunction, Request, Response } from "express";
import type { AppError } from "../errors/CustomErrorBase";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
