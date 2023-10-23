export interface ICustomError extends Error {
  message: string;
  statusCode: number;
  logMessage: string;
}
