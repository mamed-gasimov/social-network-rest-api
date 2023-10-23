import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { allowedKeysForCreateProject } from '@interfaces/projects/createProject';
import { CustomError } from '@helpers/customError';

const getProjectController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default getProjectController;
