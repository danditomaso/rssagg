import CustomError from './CustomErrorBase'

type ErrorName =
  | 'DB_ERROR'
  | 'UPDATE_ERROR'



type DatabaseErrorProps = {
  name: ErrorName;
  message: string;
  cause?: unknown;
}

export default class DatabaseError extends CustomError {
  name: ErrorName;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: DatabaseErrorProps) {
    super({ name, message, cause });
    this.name = name
    this.message = message;
    this.cause = cause;
  }



}