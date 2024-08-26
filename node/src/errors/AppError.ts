import CustomError from './CustomErrorBase'

type ErrorName =
  | 'BAD_PARAM'
  | 'MISSING_PARAM'
  | 'DB_ERROR'
  | 'BAD_REQUEST'
  | 'ERROR_FETCHING'
  | 'MISSING_AUTH'
  | 'MALFORMED_AUTH'
  | 'UNEXPECTED_AUTH_ERROR'


type AppErrorProps = {
  name: ErrorName;
  message: string;
  cause?: unknown;
}

export default class AppError extends CustomError {
  name: ErrorName;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: AppErrorProps) {
    super({ name, message, cause });
    this.name = name
    this.message = message;
    this.cause = cause;
  }



}