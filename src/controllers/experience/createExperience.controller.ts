import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateExperienceRequestBody } from '@interfaces/experience/createExperience';
import { UserRole } from '@models/user.model';

const createExperienceController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { experienceService, authService },
    } = context;

    const { id: currentUserId } = req.user as { id: number; role: UserRole };
    if (currentUserId !== +req.body.userId) {
      logger.error('You can not create experience for another user');
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: 'You can not create experience for another user' });
    }

    const foundUser = await authService.findUserById(req.body.userId);

    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { userId, companyName, role, startDate, endDate, description } = req.body as CreateExperienceRequestBody;
    const newExperience = { userId, companyName, role, startDate, endDate, description };
    const createdExperience = await experienceService.createExperience(newExperience);

    logger.info('Experience was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json(createdExperience);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default createExperienceController;
