import express from 'express';
import passport from 'passport';

import { Context } from '@interfaces/general';
import { makeAuthRouter, makeUsersRouter, makeExperienceRouter, makeFeedbackRouter } from '@routes/index';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api/users', passport.authenticate('jwt', { session: false }), makeUsersRouter(context));
  app.use('/api/experience', passport.authenticate('jwt', { session: false }), makeExperienceRouter(context));
  app.use('/api/feedback', passport.authenticate('jwt', { session: false }), makeFeedbackRouter(context));
};
