import { Response, NextFunction } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';

export const logRequestId = (req: ExtendedRequest, _res: Response, next: NextFunction) => {
  logger.info(`${req.id}-${req.baseUrl}${req.route.path}-${req.method}`);

  next();
};
