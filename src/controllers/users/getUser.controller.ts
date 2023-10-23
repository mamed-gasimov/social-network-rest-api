import { NextFunction, Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetUserRequestParams, GetUserResponseBody } from '@interfaces/users/getUsers';
import { CustomError } from '@helpers/customError';

const getUserController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as GetUserRequestParams;

    const {
      services: { usersService },
    } = context;

    const selectFields = ['id', 'firstName', 'lastName', 'email', 'title', 'summary', 'role'];
    const foundUser = await usersService.getUser(selectFields, id);

    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { firstName, lastName, title, summary, email, role } = foundUser;
    const resBody: GetUserResponseBody = {
      id: `${id}`,
      firstName,
      lastName,
      title,
      summary,
      email,
      role,
    };

    logger.info('User was found successfully');
    return res.status(HTTP_STATUSES.OK).json(resBody);
  } catch (error) {
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default getUserController;
