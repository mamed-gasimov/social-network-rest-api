import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';
import { CustomError } from '@helpers/customError';

const getExperienceController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as unknown as { id: number };

      const {
        services: { experienceService },
      } = context;

      const selectFields = ['id', ...Object.keys(allowedKeysForCreateExperience)];
      const foundExperience = await experienceService.getExperienceById(selectFields, id);

      if (!foundExperience) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Experience was not found');
        return next(err);
      }

      logger.info('Experience was found successfully');
      return res.status(HTTP_STATUSES.OK).json(foundExperience);
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default getExperienceController;
