import express from 'express';
import multer from 'multer';

import { Context, RouterFactory } from '@interfaces/general';
import { createUserController } from '@controllers/index';
import { logRequestId } from '@middleware/logger/logRequestId';
import { createUserValidationSchema } from '@middleware/validation';

export const makeUsersRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post('/', logRequestId, upload.none(), createUserValidationSchema, createUserController(context));

  return router;
};
