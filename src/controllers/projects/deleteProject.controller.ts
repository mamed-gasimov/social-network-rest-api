import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';

const deleteProjectController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

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
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default deleteProjectController;
