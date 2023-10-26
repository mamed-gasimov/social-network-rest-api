import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CustomError } from '@helpers/customError';
import { redisClient } from '@services/cache/base.cache';

const deleteProjectController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { projectsService },
      } = context;

      const selectFields = ['id'];
      const foundProject = await projectsService.getProjectById(selectFields, +req.params.id);
      if (!foundProject) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Project was not found');
        if (process.env.NODE_ENV === 'test') {
          return res.status(err.statusCode).json({ message: err.logMessage });
        }
        return next(err);
      }

      const { id, role: userRole } = req.user as { id: number; role: UserRole };
      if (+foundProject.userId !== id && userRole !== UserRole.Admin) {
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'Only admin can delete project created by another user.');
        if (process.env.NODE_ENV === 'test') {
          return res.status(err.statusCode).json({ message: err.logMessage });
        }
        return next(err);
      }

      if (!redisClient.isOpen && process.env.NODE_ENV !== 'test') {
        await redisClient.connect();
      }

      await projectsService.deleteProjectById(+req.params.id);
      if (redisClient.isOpen) {
        await redisClient.unlink(`capstone-project-user-${req.body.userId}`);
      }

      logger.info('Project was deleted successfully');
      return res.status(HTTP_STATUSES.DELETED).json();
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default deleteProjectController;
