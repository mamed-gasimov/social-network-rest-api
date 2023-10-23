import { NextFunction, Request, Response } from 'express';

import { UserRole } from '@models/user.model';
import { HTTP_STATUSES } from '@interfaces/general';
import { CustomError } from '@helpers/customError';

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
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Forbidden action');
        return next(err);
      }
      if (checkForAdmin && role === UserRole.Admin) {
        return next();
      }

      const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Forbidden action');
      return next(err);
    }

    next();
  };
