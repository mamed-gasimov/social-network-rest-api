import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateProjectRequestBody } from '@interfaces/projects/createProject';
import { CustomError } from '@helpers/customError';
import { redisClient } from '@services/cache/base.cache';

const createProjectController =
  (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        services: { projectsService, authService },
      } = context;

      const { id: currentUserId } = req.user as { id: number };
      if (currentUserId !== +req.body.userId) {
        const err = new CustomError(HTTP_STATUSES.FORBIDDEN, 'You can not create project for another user');
        return next(err);
      }

      if (!req.file) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'Project image file is required');
        return next(err);
      }

      const foundUser = await authService.findUserById(req.body.userId);

      if (!foundUser) {
        const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'User was not found');
        return next(err);
      }

      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const { userId, description } = req.body as CreateProjectRequestBody;

      const newProject = { userId: +userId, image: req.file.filename, description };
      const { id } = await projectsService.createProject(newProject);
      await redisClient.unlink(`capstone-project-user-${foundUser.id}`);

      logger.info('Project was successfully created');
      return res.status(HTTP_STATUSES.CREATED).json({ id, ...newProject });
    } catch (error) {
      const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
      next(err);
    }
  };

export default createProjectController;
