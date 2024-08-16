type ErrorName =
  | 'BAD_REQUEST'
  | 'MISSING_AUTH'
  | 'MALFORMED_AUTH'
  | 'UNEXPECTED_AUTH_ERROR'


type AppErrorProps = {
  name: ErrorName;
  message: string;
  cause?: unknown;
}

export class AppError extends Error {
  name: ErrorName;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: AppErrorProps) {
    super();
    this.name = name
    this.message = message;
    this.cause = cause;
  }



}