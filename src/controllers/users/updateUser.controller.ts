import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { UserRole } from '@models/user.model';
import { CreateUserRequestBody, CreateUserResponseBody } from '@interfaces/users/createUser';
import { CustomError } from '@helpers/customError';

const updateUserController = (context: Context) => async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      services: { authService, usersService },
    } = context;

    const foundUser = await authService.findUserById(req.params.id);

    if (!foundUser) {
      logger.error('User was not found');
      return res.status(HTTP_STATUSES.NOT_FOUND).json({ message: 'User was not found' });
    }

    const { firstName, lastName, title, summary, email, password, role } = req.body as CreateUserRequestBody;

    const userWithEmailExists = await authService.findUserByEmail(email);

    if (userWithEmailExists && userWithEmailExists.id !== foundUser.id) {
      logger.error('This email is being used already');
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'This email is being used already' });
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
