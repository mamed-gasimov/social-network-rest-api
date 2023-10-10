import express, { Response } from 'express';

import { Context, RouterFactory } from '../interfaces/general';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello!' });
  });

  return router;
};
