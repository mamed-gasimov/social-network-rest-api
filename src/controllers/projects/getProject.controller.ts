import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';

const getProjectController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { projectsService },
    } = context;

    const selectFields = ['id', 'userId', 'image', 'description'];
    const foundProject = await projectsService.getProjectById(selectFields, +req.params.id);
    if (!foundProject) {
      logger.error('Project was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Project was not found' });
    }

    logger.info('Project was found successfully');
    return res.status(HTTP_STATUSES.OK).json(foundProject);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getProjectController;
