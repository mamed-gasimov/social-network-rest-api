import express from 'express';
import passport from 'passport';

import { config } from '@config';
import { errorHandler } from '@middleware/errorHandler/errorHandler';

import { loadMiddlewares } from './middlewares';
import { loadRoutes } from './routes';
import { loadContext } from './context';
import { loadModels } from './models';
import { loadSequelize } from './sequelize';
import { loadPassport } from './passport';

export const loadApp = async () => {
  const app = express();
  const sequelize = loadSequelize(config);

  const models = loadModels(sequelize);

  const context = await loadContext(models, sequelize);

  loadPassport(app, context);
  loadMiddlewares(app, context);

  app.use(passport.initialize());

  loadRoutes(app, context);
  app.use(errorHandler);

  return app;
};
