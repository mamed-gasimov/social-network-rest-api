import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetUserRequestParams } from '@interfaces/users/getUsers';
import { CustomError } from '@helpers/customError';

const deleteUserController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default deleteUserController;
