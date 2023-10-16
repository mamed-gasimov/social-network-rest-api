import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { ExtendedRequest } from '@interfaces/express';
import { logger } from '@libs/logger';
import { Context, HTTP_STATUSES } from '@interfaces/general';
import { checkForAllowedFields } from '@helpers/checkForAllowedFields';
import { UserRole } from '@models/user.model';
import { CreateUserRequestBody, CreateUserResponseBody } from '@interfaces/users/createUser';

const updateUserController = (context: Context) => async (req: ExtendedRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error(errors.array()?.[0]?.msg);
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: errors.array()?.[0]?.msg });
    }

    const allowedKeys = ['id'];
    const allowedRqBodyKeys = ['firstName', 'lastName', 'email', 'password', 'summary', 'title', 'role'];
    if (Object.keys(req.query).length > allowedKeys.length || Object.keys(req.body).length > allowedRqBodyKeys.length) {
      const onlyAllowedFields =
        checkForAllowedFields(req.query, allowedKeys) && checkForAllowedFields(req.body, allowedRqBodyKeys);

      if (!onlyAllowedFields) {
        logger.error('Invalid fields');
        return res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Invalid fields' });
      }
    }

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
    logger.error(error);
    return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong on the server.' });
  }
};

export default updateUserController;
