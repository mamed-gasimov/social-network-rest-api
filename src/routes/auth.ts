import express from 'express';
import multer from 'multer';

import { loginController, registerController } from '@controllers/index';
import { Context, RouterFactory } from '@interfaces/general';
import { registerValidationSchema, loginValidationSchema, checkForAllowedFields } from '@middleware/validation';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { logRequestId } from '@middleware/logger/logRequestId';
import { allowedKeysForLogin } from '@interfaces/auth/login';
import { allowedKeysForRegister } from '@interfaces/auth/register';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post(
    '/register',
    logRequestId,
    uploadFile('avatar'),
    checkForAllowedFields(allowedKeysForRegister),
    registerValidationSchema,
    registerController(context),
  );

  router.post(
    '/login',
    logRequestId,
    upload.none(),
    checkForAllowedFields(allowedKeysForLogin),
    loginValidationSchema,
    loginController,
  );

  return router;
};
