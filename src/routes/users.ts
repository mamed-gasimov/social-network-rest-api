import express from 'express';
import multer from 'multer';

import { Context, RouterFactory } from '@interfaces/general';
import { createUserController, getUsersController } from '@controllers/index';
import { logRequestId } from '@middleware/logger/logRequestId';
import { createUserValidationSchema, getUsersValidationSchema } from '@middleware/validation';
import { roles } from '@middleware/roles/checkRole';
import { UserRole } from '@models/user.model';

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

  return router;
};
