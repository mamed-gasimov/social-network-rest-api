import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetResourceRequestQuery } from '@interfaces/paginationQuery';
import { allowedKeysForCreateExperience } from '@interfaces/experience/createExperience';

const getExperiencesController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const { page, pageSize } = req.query as unknown as GetResourceRequestQuery;

    const {
      services: { experienceService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateExperience)];
    const skip = (page - 1) * pageSize;
    const { rows, count } = await experienceService.getExperiences(selectFields, +skip, +pageSize);

    logger.info('List of experiences was successfully returned');
    return res.status(HTTP_STATUSES.OK).header('X-total-count', `${count}`).json(rows);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getExperiencesController;
