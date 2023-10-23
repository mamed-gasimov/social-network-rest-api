export class CustomError extends Error {
  statusCode: number;

  logMessage: string;

  constructor(statusCode: number, logMessage: string) {
    super(logMessage);

    this.statusCode = statusCode;
    this.logMessage = logMessage;
  }
}
