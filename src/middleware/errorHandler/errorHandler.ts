import { NextFunction, Request, Response } from 'express';

import { logger } from '@libs/logger';
import { ICustomError } from '@interfaces/errorHandler';
import { HTTP_STATUSES } from '@interfaces/general';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: ICustomError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error?.logMessage);
  if (error?.statusCode === HTTP_STATUSES.INTERNAL_SERVER_ERROR) {
    logger.error(error.message);
  }
  res.status(error?.statusCode).json({ message: error?.logMessage });
};
