import { Request, Response } from 'express';

import { logger } from '@libs/logger';
import { ICustomError } from '@interfaces/errorHandler';

export const errorHandler = (error: ICustomError, _req: Request, res: Response) => {
  logger.error(error?.logMessage || error.message);
  res.status(error.statusCode).json({ message: error.message });
};
