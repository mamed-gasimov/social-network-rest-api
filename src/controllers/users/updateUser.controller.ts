import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CreateUserRequestBody, CreateUserResponseBody } from '@interfaces/users/createUser';
import { CustomError } from '@helpers/customError';
import { redisClient } from '@services/cache/base.cache';

const updateUserController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      services: { authService, usersService },
    } = context;

    const foundUser = await authService.findUserById(req.params.id);

    if (!foundUser) {
      const err = new CustomError(HTTP_STATUSES.NOT_FOUND, 'User was not found');
      if (process.env.NODE_ENV === 'test') {
        return res.status(err.statusCode).json({ message: err.logMessage });
      }
      return next(err);
    }

    const { firstName, lastName, title, summary, email, password, role } = req.body as CreateUserRequestBody;

    const userWithEmailExists = await authService.findUserByEmail(email);

    if (userWithEmailExists && userWithEmailExists.id !== foundUser.id) {
      const err = new CustomError(HTTP_STATUSES.BAD_REQUEST, 'This email is being used already');
      if (process.env.NODE_ENV === 'test') {
        return res.status(err.statusCode).json({ message: err.logMessage });
      }
      return next(err);
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let userRole = foundUser.role;

    if (role !== UserRole.Admin) {
      userRole = role;
    }

    const userInfoForUpdate: CreateUserRequestBody = {
      firstName,
      lastName,
      title,
      summary,
      password: hashedPassword,
      role: userRole,
      email,
    };

    if (req.file) {
      userInfoForUpdate.image = req.file.filename;
    }

    await usersService.updateUser(+req.params.id, userInfoForUpdate);
    await redisClient.unlink(`capstone-project-user-${foundUser.id}`);

    delete userInfoForUpdate.password;
    const updatedUserInfo: CreateUserResponseBody = { id: `${req.params.id}`, ...userInfoForUpdate };

    logger.info('User was updated successfully');
    return res.status(HTTP_STATUSES.OK).json(updatedUserInfo);
  } catch (error) {
    const err = new CustomError(HTTP_STATUSES.INTERNAL_SERVER_ERROR, 'Something went wrong on the server.');
    next(err);
  }
};

export default updateUserController;
