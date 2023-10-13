import express from 'express';

import { registerController } from '@controllers/index';
import { Context, RouterFactory } from '@interfaces/general';
import { registerValidationSchema } from '@middleware/validation/register';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { logRequestId } from '@middleware/logger/logRequestId';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post('/register', logRequestId, uploadFile, registerValidationSchema, registerController(context));

  return router;
};
