import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { getCVController } from '@controllers/index';
import { paramUserIdValidationSchema } from '@middleware/validation/paramId';
import { validate } from '@middleware/validation';

export const makeCVRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.get('/:userId/cv', logRequestId, paramUserIdValidationSchema, validate, getCVController(context));

  return router;
};
