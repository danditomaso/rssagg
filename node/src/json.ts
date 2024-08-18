import type { Response } from "express";
import { logger } from "./utils/logger";

export function respondWithError(res: Response, code: number, msg: string) {
  return respondWithJSON(res, code, { error: msg });
}

export function respondWithJSON<T>(
  res: Response,
  code: number,
  payload: Record<string, T>
) {
  console.log('payload', payload);

  if (code > 499) {
    logger.trace("Responding with 5XX error");
    return res.status(code).json({ ...payload });
  }

  try {
    return res.status(code).json(payload);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating response payload", err });
  }
}
