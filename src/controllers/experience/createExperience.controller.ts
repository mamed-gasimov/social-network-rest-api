import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateExperienceRequestBody } from '@interfaces/experience/createExperience';
import { UserRole } from '@models/user.model';
import { CustomError } from '@helpers/customError';

const createExperienceController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { experienceService, authService },
      } = context;

      const { id: currentUserId } = req.user as { id: number; role: UserRole };
      if (currentUserId !== +req.body.userId) {
        const error = new CustomError(HTTP_STATUSES.FORBIDDEN, 'You can not create experience for another user');
        return next(error);
      }

      const foundUser = await authService.findUserById(req.body.userId);

      if (!foundUser) {
        const error = new CustomError(HTTP_STATUSES.NOT_FOUND, 'User was not found');
        return next(error);
      }

      const { userId, companyName, role, startDate, endDate, description } = req.body as CreateExperienceRequestBody;
      const newExperience = { userId, companyName, role, startDate, endDate, description };
      const { id } = await experienceService.createExperience(newExperience);

      logger.info('Experience was successfully created');
      return res.status(HTTP_STATUSES.CREATED).json({ id, ...newExperience });
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default createExperienceController;
