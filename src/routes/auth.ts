import express from 'express';
import multer from 'multer';

import { registerController } from '@controllers/index';
import { Context, RouterFactory } from '@interfaces/general';
import { registerValidationSchema } from '@middleware/validation/register';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();
  const upload = multer();

  router.post('/register', upload.none(), registerValidationSchema, registerController(context));

  return router;
};
