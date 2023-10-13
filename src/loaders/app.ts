import express from 'express';

import { config } from '@config';

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

  const context = await loadContext(models);

  loadPassport(app, context);
  loadMiddlewares(app, context);
  loadRoutes(app, context);

  return app;
};
