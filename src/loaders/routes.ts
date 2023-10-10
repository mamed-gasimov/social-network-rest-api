import express from 'express';

import { makeAuthRouter } from '@routes/auth';
import { Context } from '@interfaces/general';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/api/auth', makeAuthRouter(context));
};
