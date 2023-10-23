import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetUserRequestParams } from '@interfaces/users/getUsers';

const deleteUserController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params as unknown as GetUserRequestParams;

    const {
      services: { usersService, experienceService, authService },
    } = context;

    const foundUser = await authService.findUserById(req.params.id);
    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    await usersService.deleteUser(id, experienceService);

    logger.info('User was deleted successfully');
    return res.status(HTTP_STATUSES.DELETED).json();
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default deleteUserController;
