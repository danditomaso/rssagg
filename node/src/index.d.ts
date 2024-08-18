import type { User } from "./types/User";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
