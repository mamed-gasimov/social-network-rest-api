import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';

export const checkForAllowedFields =
  (allowedKeys: Record<string, number>, isQuery?: boolean) => (req: Request, res: Response, next: NextFunction) => {
    let onlyAllowedFields = true;
    let obj = req.body;
    if (isQuery) {
      obj = req.query;
    }

    Object.keys(obj).forEach((key) => {
      if (!allowedKeys[key]) {
        onlyAllowedFields = false;
      }
    });

    if (!onlyAllowedFields) {
      logger.error('Invalid fields');
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
    }

    next();
  };
