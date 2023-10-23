import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CustomError } from '@helpers/customError';

const deleteProjectController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { projectsService },
      } = context;

      const { id, role: userRole } = req.user as { id: number; role: UserRole };
      if (+req.body.userId !== id && userRole !== UserRole.Admin) {
        logger.error('Forbidden action. Only admin can delete project created by another user.');
        return res
          .status(HTTP_STATUSES.FORBIDDEN)
          .json({ message: 'Only admin can delete project created by another user.' });
      }

      const selectFields = ['id'];
      const foundProject = await projectsService.getProjectById(selectFields, +req.params.id);
      if (!foundProject) {
        logger.error('Project was not found');
        return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Project was not found' });
      }

      await projectsService.deleteProjectById(+req.params.id);

      logger.info('Project was deleted successfully');
      return res.status(HTTP_STATUSES.DELETED).json();
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default deleteProjectController;
