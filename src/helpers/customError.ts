export class CustomError extends Error {
  statusCode: number;

  logMessage: string;

  constructor(statusCode: number, message: string, logMessage?: string) {
    super(message);

    this.statusCode = statusCode;
    this.logMessage = logMessage || message;
  }
}
