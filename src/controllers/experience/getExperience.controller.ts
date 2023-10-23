import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';

const getExperienceController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params as unknown as { id: number };

    const {
      services: { experienceService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateExperience)];
    const foundExperience = await experienceService.getExperienceById(selectFields, id);

    if (!foundExperience) {
      logger.error('Experience was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Experience was not found' });
    }

    logger.info('Experience was found successfully');
    return res.status(HTTP_STATUSES.OK).json(foundExperience);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getExperienceController;
