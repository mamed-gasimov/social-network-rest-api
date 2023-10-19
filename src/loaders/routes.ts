import express from 'express';
import passport from 'passport';

import { Context } from '@interfaces/general';
import {
  makeAuthRouter,
  makeUsersRouter,
  makeExperienceRouter,
  makeFeedbackRouter,
  makeProjectsRouter,
  makeCVRouter,
} from '@routes/index';

export const loadRoutes = (app: express.Router, context: Context) => {
  app.use('/api/auth', makeAuthRouter(context));
  app.use('/api/users', passport.authenticate('jwt', { session: false }), makeUsersRouter(context));
  app.use('/api/experience', passport.authenticate('jwt', { session: false }), makeExperienceRouter(context));
  app.use('/api/feedback', passport.authenticate('jwt', { session: false }), makeFeedbackRouter(context));
  app.use('/api/projects', passport.authenticate('jwt', { session: false }), makeProjectsRouter(context));
  app.use('/api/user', passport.authenticate('jwt', { session: false }), makeCVRouter(context));
};
