import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { CreateUserRequestBody, CreateUserResponseBody } from '@interfaces/users/createUser';
import { CustomError } from '@helpers/customError';

const createUserController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, summary, title, role } = req.body as CreateUserRequestBody;
    const {
      services: { authService },
    } = context;

    const existedUser = await authService.findUserByEmail(email);
    if (existedUser) {
      const err = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'The user with the current email already exists.');
      return next(err);
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
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default createUserController;
