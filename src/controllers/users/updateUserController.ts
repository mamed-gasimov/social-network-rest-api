import { Response } from 'express';
import { validationResult } from 'express-validator';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { checkForAllowedFields } from '@helpers/checkForAllowedFields';

const updateUserController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['id'];
    if (Object.keys(req.query).length > allowedKeys.length) {
      const onlyAllowedFields = checkForAllowedFields(req.query, allowedKeys);

      if (!onlyAllowedFields) {
        logger.error('Invalid fields');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

    const {
      services: { usersService },
    } = context;

    logger.info('User was updated successfully');
    return res.status(HTTP_STATUSES.OK).json();
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default updateUserController;
