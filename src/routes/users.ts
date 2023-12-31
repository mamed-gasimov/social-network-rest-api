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
  queryForPaginationValidationSchema,
  checkForAllowedFields,
  validate,
} from '@middleware/validation';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import { userOwnAccount } from '@middleware/roles/userOwnAccount';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { allowedKeysForCreateUser } from '@interfaces/users/createUser';
import { allowedKeysForGetResourceWithPagination } from '@interfaces/paginationQuery';

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
    validate,
    createUserController(context),
  );

  router.get(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    checkForAllowedFields(allowedKeysForGetResourceWithPagination, true),
    queryForPaginationValidationSchema,
    validate,
    getUsersController(context),
  );
  router.get('/:id', logRequestId, paramIdValidationSchema, validate, getUserController(context));

  router.delete(
    '/:id',
    logRequestId,
    userOwnAccount({ checkForAdmin: true }),
    paramIdValidationSchema,
    validate,
    deleteUserController(context),
  );

  router.put(
    '/:id',
    logRequestId,
    uploadFile('avatar'),
    userOwnAccount({ checkForAdmin: false }),
    checkForAllowedFields(allowedKeysForCreateUser),
    [...paramIdValidationSchema, ...createUserValidationSchema],
    validate,
    updateUserController(context),
  );

  return router;
};
