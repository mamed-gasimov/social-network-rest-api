import express from 'express';
import requestID from 'express-request-id';
import cors from 'cors';

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

  loadModels(sequelize);

  const context = await loadContext();
  app.use(cors());
  app.use(requestID());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(express.json());

  loadPassport(app, context);
  loadMiddlewares(app, context);
  loadRoutes(app, context);

  return app;
};
