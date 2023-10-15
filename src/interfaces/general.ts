import express from 'express';

import { User, Project, FeedBack, Experience } from '@models/index';
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
  experience: typeof Experience;
}

export enum HTTP_STATUSES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 505,
}
