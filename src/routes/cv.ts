import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { getCVController } from '@controllers/index';
import { paramUserIdValidationSchema } from '@middleware/validation/paramId';

export const makeCVRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.get('/:userId/cv', logRequestId, paramUserIdValidationSchema, getCVController(context));

  return router;
};
