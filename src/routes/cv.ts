import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';
import { getCVController } from '@controllers/index';

export const makeCVRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.get('/:userId/cv', logRequestId, getCVController(context));

  return router;
};
