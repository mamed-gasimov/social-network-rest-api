import { NextFunction, Request, Response } from 'express';

import { UserRole } from '@models/user.model';
import { HTTP_STATUSES } from '@interfaces/general';
import { logger } from '@libs/logger';

type CheckForAdmin = {
  checkForAdmin: boolean;
};

export const userOwnAccount =
  ({ checkForAdmin }: CheckForAdmin) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.user as { id: number; role: UserRole };
    const userId = +req.params.id;

    if (userId !== id) {
      if (checkForAdmin && role !== UserRole.Admin) {
        logger.error('Forbidden action');
        return res.status(HTTP_STATUSES.FORBIDDEN).json();
      }
      if (checkForAdmin && role === UserRole.Admin) {
        return next();
      }

      logger.error('Forbidden action');
      return res.status(HTTP_STATUSES.FORBIDDEN).json();
    }

    next();
  };
