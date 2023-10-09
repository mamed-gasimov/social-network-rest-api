import express from 'express';

import { User, Project, FeedBack } from '@models/index';
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
  project: typeof Project;
  feedback: typeof FeedBack;
}
