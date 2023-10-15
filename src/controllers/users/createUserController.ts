import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { checkForAllowedFields } from 'src/helpers/checkForAllowedFields';
import { CreateUserRequestBody, CreateUserResponseBody } from '@interfaces/users/createUser';

const createUserController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['firstName', 'lastName', 'email', 'password', 'summary', 'title', 'role'];
    if (Object.keys(req.body).length > allowedKeys.length) {
      const onlyAllowedFields = checkForAllowedFields(req, allowedKeys);

      if (!onlyAllowedFields) {
        logger.error('Invalid fields');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

    const { firstName, lastName, email, password, summary, title, role } = req.body as CreateUserRequestBody;
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
    const image = 'default.png';

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      summary,
      title,
      role,
      image,
    };

    const { id } = await authService.createUser(newUser);
    delete newUser.password;
    delete newUser.image;
    const createdUser: CreateUserResponseBody = { ...newUser, id: `${id}` };

    logger.info('User was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json(createdUser);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default createUserController;
