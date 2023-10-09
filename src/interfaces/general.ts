import express from 'express';

import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

export interface Context {
  services: {
    authService: AuthService;
  };
}

export type RouterFactory = (context: Context) => express.Router;

export type Loader = (app: express.Application, context: Context) => void;

export interface Models {
  user: typeof User;
}
