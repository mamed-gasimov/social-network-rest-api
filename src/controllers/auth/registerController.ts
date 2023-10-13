import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { RegisterRequestBody, RegisterResponseBody } from '@interfaces/auth/register';
import { checkForAllowedFields } from 'src/helpers/checkForAllowedFields';
import { UserRole } from '@models/user.model';

const registerController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['firstName', 'lastName', 'email', 'password', 'summary', 'title'];
    if (Object.keys(req.body).length > allowedKeys.length) {
      const onlyAllowedFields = checkForAllowedFields(req, allowedKeys);

      if (!onlyAllowedFields) {
        logger.error('Invalid fields');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

    const { firstName, lastName, email, password, summary, title } = req.body as RegisterRequestBody;
    const {
      services: { authService },
    } = context;

    const existedUser = await authService.findUserByEmail(email);
    if (existedUser) {
      logger.error('The user with the current email already exists.');
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'The user with the current email already exists.' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let image = 'default.png';
    if (req.file) {
      image = req.file.filename;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      summary,
      title,
      role: UserRole.User,
      image,
    };

    const { id } = await authService.createUser(newUser);
    delete newUser.password;
    const createdUser: RegisterResponseBody = { ...newUser, id };

    logger.info('User was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json(createdUser);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default registerController;
