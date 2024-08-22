import CustomError from './CustomErrorBase'

type ErrorName =
  | 'BAD_REQUEST'
  | 'ERROR_PARSING_XML'
  | 'AUTH_MISSING'
  | 'AUTH_MALFORMED'
  | 'AUTH_API_KEY_MALFORMED'
  | 'AUTH_UNEXPECTED_ERROR'


type HttpErrorProps = {
  name: ErrorName;
  message: string;
  cause?: unknown;
}

export default class HttpError extends CustomError {
  name: ErrorName;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: HttpErrorProps) {
    super({ name, message, cause });
    this.name = name
    this.message = message;
    this.cause = cause;
  }



}