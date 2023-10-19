import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CreateProjectRequestBody, allowedKeysForCreateProject } from '@interfaces/projects/createProject';

const updateProjectController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const {
      services: { projectsService },
    } = context;

    const { userId, description } = req.body as CreateProjectRequestBody;

    const selectFields = ['id', ...Object.keys(allowedKeysForCreateProject)];
    const foundProject = await projectsService.getProjectById(selectFields, +req.params.id);

    if (!foundProject) {
      logger.error('Project was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'Project was not found' });
    }

    const { id, role: userRole } = req.user as { id: number; role: UserRole };
    if (foundProject.userId !== id && userRole !== UserRole.Admin) {
      logger.error('Forbidden action. Only admin can update project created by another user.');
      return res
        .status(HTTP_STATUSES.FORBIDDEN)
        .json({ message: 'Only admin can update project created by another user.' });
    }

    if (foundProject.userId !== +userId) {
      logger.error('Forbidden action. You can not change "userId" field.');
      return res.status(HTTP_STATUSES.FORBIDDEN).json({ message: 'You can not change "userId" field' });
    }

    const updatedProject = {
      userId: foundProject.userId,
      image: req.file ? req.file.filename : foundProject.image,
      description,
    };

    await projectsService.updateProject(foundProject.id, updatedProject);

    logger.info('Project was updated successfully');
    return res.status(HTTP_STATUSES.OK).json({ id: foundProject.id, ...updatedProject });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default updateProjectController;
