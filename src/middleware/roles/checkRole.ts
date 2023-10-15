import { NextFunction, Request, Response } from 'express';

import { UserRole } from '@models/user.model';
import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';

export const roles = (userRoles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user as { id: number; role: UserRole };

  if (!userRoles.includes(role)) {
    logger.error('Invalid user role');
    return res.status(HTTP_STATUSES.FORBIDDEN).json();
  }

  next();
};
