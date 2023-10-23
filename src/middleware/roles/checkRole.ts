import { NextFunction, Request, Response } from 'express';

import { UserRole } from '@models/user.model';
import { HTTP_STATUSES } from '@interfaces/general';
import { CustomError } from '@helpers/customError';

export const roles = (userRoles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user as { id: number; role: UserRole };

  if (!userRoles.includes(role)) {
    const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Invalid user role');
    return next(err);
  }

  next();
};
