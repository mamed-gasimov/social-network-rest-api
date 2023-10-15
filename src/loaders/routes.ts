import express from 'express';
import passport from 'passport';

import { makeAuthRouter } from '@routes/auth';
import { Context } from '@interfaces/general';
import { makeUsersRouter } from '@routes/users';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api/users', passport.authenticate('jwt', { session: false }), makeUsersRouter(context));
};
