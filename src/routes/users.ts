import express from 'express';
import multer from 'multer';

import { Context, RouterFactory } from '@interfaces/general';
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from '@controllers/index';
import { logRequestId } from '@middleware/logger/logRequestId';
import {
  createUserValidationSchema,
  paramIdValidationSchema,
  getUsersValidationSchema,
  checkForAllowedFields,
} from '@middleware/validation';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import { userOwnAccount } from '@middleware/roles/userOwnAccount';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { allowedKeysForCreateUser } from '@interfaces/users/createUser';
import { allowedKeysForGetUsers } from '@interfaces/users/getUsers';

export const makeUsersRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    upload.none(),
    checkForAllowedFields(allowedKeysForCreateUser),
    createUserValidationSchema,
    createUserController(context),
  );

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetUsers, true),
    getUsersValidationSchema,
    getUsersController(context),
  );
  router.get('/:id', logRequestId, paramIdValidationSchema, getUserController(context));

  router.delete(
    '/:id',
    logRequestId,
    userOwnAccount({ checkForAdmin: true }),
    paramIdValidationSchema,
    deleteUserController(context),
  );

  router.put(
    '/:id',
    logRequestId,
    uploadFile,
    userOwnAccount({ checkForAdmin: false }),
    checkForAllowedFields(allowedKeysForCreateUser),
    [...paramIdValidationSchema, ...createUserValidationSchema],
    updateUserController(context),
  );

  return router;
};
