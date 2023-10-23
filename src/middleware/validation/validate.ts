import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { CustomError } from '@helpers/customError';
import { HTTP_STATUSES } from '@interfaces/general';

export const validate = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.array()?.[0]?.msg;
    const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, msg);
    return next(error);
  }

  return next();
};
