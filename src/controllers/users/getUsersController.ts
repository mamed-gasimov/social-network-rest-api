import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { checkForAllowedFields } from '@helpers/checkForAllowedFields';
import { GetUsersRequestQuery } from '@interfaces/users/getUsers';

const getUsersController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['pageSize', 'page'];
    if (Object.keys(req.query).length > allowedKeys.length) {
      const onlyAllowedFields = checkForAllowedFields(req.query, allowedKeys);

      if (!onlyAllowedFields) {
        logger.error('Invalid fields');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

    const { page, pageSize } = req.query as unknown as GetUsersRequestQuery;

    const {
      services: { usersService },
    } = context;

    const selectFields = ['id', 'firstName', 'lastName', 'email', 'title', 'summary', 'role'];
    const skip = (page - 1) * pageSize;
    const { rows } = await usersService.findAll(selectFields, +skip, +pageSize);
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
