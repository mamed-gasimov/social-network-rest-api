import express from 'express';

import { User, Project, FeedBack, Experience } from '@models/index';
import { AuthService, UsersService, ExperienceService, FeedbackService, ProjectsService } from '@services/db';

export interface Context {
  services: {
    authService: AuthService;
    usersService: UsersService;
    experienceService: ExperienceService;
    feedbackService: FeedbackService;
    projectsService: ProjectsService;
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
  DELETED = 204,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 505,
}
