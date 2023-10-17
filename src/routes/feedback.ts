import express from 'express';

import { Context, RouterFactory } from '@interfaces/general';
import { logRequestId } from '@middleware/logger/logRequestId';

export const makeFeedbackRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.post('/', logRequestId);

  return router;
};
