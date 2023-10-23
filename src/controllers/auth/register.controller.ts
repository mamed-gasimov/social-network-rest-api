import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { RegisterRequestBody, RegisterResponseBody } from '@interfaces/auth/register';
import { UserRole } from '@models/user.model';
import { CustomError } from '@helpers/customError';

const registerController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const msg = errors.array()?.[0]?.msg;
      const error = new CustomError(HTTP_STATUSES.BAD_REQUEST, msg);
      return next(error);
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
    delete newUser.role;
    const createdUser: RegisterResponseBody = { ...newUser, id: `${id}` };

    logger.info('User was successfully created');
    return res.status(HTTP_STATUSES.CREATED).json(createdUser);
  } catch (error) {
    const err = new CustomError(
      HTTP_STATUSES.INTERNAL_SERVER_ERROR,
      error.message,
      'Something went wrong on the server.',
    );
    next(err);
  }
};

export default registerController;
