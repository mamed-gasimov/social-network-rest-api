import express from 'express';
import multer from 'multer';

import { Context, RouterFactory } from '@interfaces/general';
import { createUserController, deleteUserController, getUsersController } from '@controllers/index';
import { logRequestId } from '@middleware/logger/logRequestId';
import { createUserValidationSchema, userIdValidationSchema, getUsersValidationSchema } from '@middleware/validation';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';
import getUserController from '@controllers/users/getUserController';
import { userOwnAccount } from '@middleware/roles/userOwnAccount';

export const makeUsersRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post(
    '/',
    logRequestId,
    roles([UserRole.Admin]),
    upload.none(),
    createUserValidationSchema,
    createUserController(context),
  );
  router.get('/', logRequestId, roles([UserRole.Admin]), getUsersValidationSchema, getUsersController(context));
  router.get('/:id', logRequestId, userIdValidationSchema, getUserController(context));
  router.delete('/:id', logRequestId, userOwnAccount, userIdValidationSchema, deleteUserController(context));

  return router;
};
