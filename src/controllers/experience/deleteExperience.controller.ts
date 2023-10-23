import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';

const deleteExperienceController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      services: { experienceService },
    } = context;

    const selectFields = ['id', 'userId'];
    const foundExperience = await experienceService.getExperienceById(selectFields, +req.params.id);

    if (!foundExperience) {
      logger.error('Experience was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Experience was not found' });
    }

    const { id, role: userRole } = req.user as { id: number; role: UserRole };
    if (foundExperience.userId !== id && userRole !== UserRole.Admin) {
      logger.error("Forbidden action. Only admin can delete other user's experience.");
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: "Only admin can delete other user's experience." });
    }

    await experienceService.deleteExperienceById(+req.params.id);

    logger.info('Experience was deleted successfully');
    return res.status(HTTP_STATUSES.DELETED).json();
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default deleteExperienceController;
