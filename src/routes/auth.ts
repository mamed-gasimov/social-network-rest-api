import express, { Response } from 'express';

import { Context, RouterFactory } from '../interfaces/general';

export const makeAuthRouter: RouterFactory = (context: Context) => {
  const router = express.Router();

  // Define routes

  return router;
};
