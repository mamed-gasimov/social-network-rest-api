import express from 'express';
import multer from 'multer';

import { loginController, registerController } from '@controllers/index';
import { Context, RouterFactory } from '@interfaces/general';
import { registerValidationSchema, loginValidationSchema } from '@middleware/validation';
import { uploadFile } from '@middleware/uploadFile/uploadFile';
import { logRequestId } from '@middleware/logger/logRequestId';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post('/register', logRequestId, uploadFile, registerValidationSchema, registerController(context));
  router.post('/login', logRequestId, upload.none(), loginValidationSchema, loginController);

  return router;
};
