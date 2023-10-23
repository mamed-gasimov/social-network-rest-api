import { Response } from 'express';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { GetResourceRequestQuery } from '@interfaces/paginationQuery';

const getUsersController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const { page, pageSize } = req.query as unknown as GetResourceRequestQuery;

    const {
      services: { usersService },
    } = context;

    const selectFields = ['id', 'firstName', 'lastName', 'email', 'title', 'summary', 'role'];
    const skip = (page - 1) * pageSize;
    const { rows } = await usersService.getUsers(selectFields, +skip, +pageSize);
    const { id } = req.user as { id: number };
    const usersExcludeCurrent = rows.filter((row) => row.id !== id);

    logger.info('List of users was successfully returned');
    return res
      .status(HTTP_STATUSES.OK)
      .header('X-total-count', `${usersExcludeCurrent.length}`)
      .json(usersExcludeCurrent);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default getUsersController;
