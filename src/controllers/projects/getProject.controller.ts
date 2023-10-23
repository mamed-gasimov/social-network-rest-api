import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateProject } from '@interfaces/projects/createProject';

const getProjectController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      services: { projectsService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateProject)];
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
