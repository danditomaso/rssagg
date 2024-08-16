/** src/middlewares/errors.ts **/
import type { NextFunction, Request, Response } from "express";
import type { CustomError } from "../errors/CustomError";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
