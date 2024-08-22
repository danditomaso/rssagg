type CustomErorProps = {
  name: string;
  message: string;
  cause?: unknown;
}

export default abstract class CustomError extends Error {
  name: string;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: CustomErorProps) {
    super();
    this.name = name
    this.message = message;
    this.cause = cause;
  }



}