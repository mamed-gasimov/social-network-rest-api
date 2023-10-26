import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '@interfaces/general';
import { CustomError } from '@helpers/customError';

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
      const err = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'Invalid fields');
      if (process.env.NODE_ENV === 'test') {
        return res.status(err.statusCode).json({ message: err.logMessage });
      }
      return next(err);
    }

    next();
  };
