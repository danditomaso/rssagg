/** src/middlewares/errors.ts **/
import type { NextFunction, Request, Response } from "express";
import type { AppError, HttpError, DatabaseError } from "../errors";

export const errorHandler = (
  err: HttpError | DatabaseError | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
