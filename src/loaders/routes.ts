import express from 'express';
import passport from 'passport';

import { Context } from '@interfaces/general';
import { makeAuthRouter } from '@routes/auth';
import { makeUsersRouter } from '@routes/users';
import { makeExperienceRouter } from '@routes/experience';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api/users', passport.authenticate('jwt', { session: false }), makeUsersRouter(context));
  app.use('/api/experience', passport.authenticate('jwt', { session: false }), makeExperienceRouter(context));
};
