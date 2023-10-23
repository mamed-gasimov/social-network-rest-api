import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetResourceRequestQuery } from '@interfaces/paginationQuery';
import { allowedKeysForCreateProject } from '@interfaces/projects/createProject';
import { CustomError } from '@helpers/customError';

const getProjectsController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = req.query as unknown as GetResourceRequestQuery;

    const {
      services: { projectsService },
    } = context;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateProject)];
    const skip = (page - 1) * pageSize;
    const { rows, count } = await projectsService.getProjects(selectFields, +skip, +pageSize);

    logger.info('List of projects was successfully returned');
    return res.status(HTTP_STATUSES.OK).header('X-total-count', `${count}`).json(rows);
  } catch (error) {
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default getProjectsController;
