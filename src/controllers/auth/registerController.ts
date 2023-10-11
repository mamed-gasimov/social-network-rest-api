import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { HTTP_STATUSES } from '@interfaces/general';
import { RegisterRequestBody } from '@interfaces/auth/register';
import { checkForAllowedFields } from 'src/helpers/checkForAllowedFields';

const registerController = async (req: ExtendedRequest, res: Response) => {
  try {
    logger.info(`${req.id}-${req.baseUrl}-${req.method}`);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['firstName', 'lastName', 'email', 'password', 'summary', 'title'];
    if (Object.keys(req.body).length > allowedKeys.length) {
      const onlyAllowedFields = checkForAllowedFields(req, allowedKeys);

      if (!onlyAllowedFields) {
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

    const { firstName, lastName, email, password, summary, title } = req.body as RegisterRequestBody;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return res.status(HTTP_STATUSES.CREATED).json();
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default registerController;
