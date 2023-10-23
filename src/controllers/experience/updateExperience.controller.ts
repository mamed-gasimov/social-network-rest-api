import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateExperienceRequestBody, allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';
import { UserRole } from '@models/user.model';
import { CustomError } from '@helpers/customError';

const updateExperienceController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { experienceService },
      } = context;

      const { companyName, role, startDate, endDate, description } = req.body as CreateExperienceRequestBody;

      const selectFields = ['id', ...Object.keys(allowedKeysForCreateExperience)];
      const foundExperience = await experienceService.getExperienceById(selectFields, +req.params.id);

      if (!foundExperience) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Experience was not found');
        return next(err);
      }

      const { id, role: userRole } = req.user as { id: number; role: UserRole };
      if (foundExperience.userId !== id && userRole !== UserRole.Admin) {
        const err = new CustomError(
          HTTP_STATUSES.FORBIDDEN,
          'Only admin can update experience created by another user.',
        );
        return next(err);
      }

      if (foundExperience.userId !== +req.body.userId) {
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'You can not change "userId" field');
        return next(err);
      }

      const updatedExperience = {
        userId: foundExperience.userId,
        companyName,
        startDate,
        endDate,
        description,
        role,
      };

      await experienceService.updateExperience(foundExperience.id, updatedExperience);

      logger.info('Experience was updated successfully');
      return res.status(HTTP_STATUSES.OK).json({ id: foundExperience.id, ...updatedExperience });
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default updateExperienceController;
