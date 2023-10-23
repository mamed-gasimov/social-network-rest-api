export interface ICustomError extends Error {
  statusCode: number;
  logMessage: string;
}
