import express from 'express';
import requestID from 'express-request-id';
import cors from 'cors';

import { Loader } from '@interfaces/general';

export const loadMiddlewares: Loader = (app) => {
  app.use(cors());
  app.use(express.static('public'));
  app.use(requestID());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(express.json());
};
