import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateProjectRequestBody } from '@interfaces/projects/createProject';

const createProjectController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      services: { projectsService, authService },
    } = context;

    const { id: currentUserId } = req.user as { id: number };
    if (currentUserId !== +req.body.userId) {
      logger.error('You can not create project for another user');
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: 'You can not create project for another user' });
    }

    if (!req.file) {
      logger.error('Project image file is required');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Project image file is required' });
    }

    const foundUser = await authService.findUserById(req.body.userId);

    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { userId, description } = req.body as CreateProjectRequestBody;

    const newProject = { userId: +userId, image: req.file.filename, description };
    const { id } = await projectsService.createProject(newProject);

    logger.info('Project was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json({ id, ...newProject });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default createProjectController;
