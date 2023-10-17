import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateExperienceRequestBody } from '@interfaces/experience/createExperience';
import { UserRole } from '@models/user.model';

const updateExperienceController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { experienceService },
    } = context;

    const { companyName, role, startDate, endDate, description } = req.body as CreateExperienceRequestBody;

    const selectFields = ['id', 'userId', 'companyName', 'role', 'startDate', 'endDate', 'description'];
    const foundExperience = await experienceService.getExperienceById(selectFields, +req.params.id);

    if (!foundExperience) {
      logger.error('Experience was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Experience was not found' });
    }

    const { id, role: userRole } = req.user as { id: number; role: UserRole };
    if (foundExperience.userId !== id && userRole !== UserRole.Admin) {
      logger.error("Forbidden action. Only admin can update other user's experience.");
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: "Only admin can update other user's experience." });
    }

    if (foundExperience.userId !== +req.body.userId) {
      logger.error('Forbidden action. You can not change userId field');
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: "You can not change 'userId' field" });
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
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default updateExperienceController;
