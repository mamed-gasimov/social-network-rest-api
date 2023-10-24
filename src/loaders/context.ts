import { Sequelize } from 'sequelize';

import { Context, Models } from '@interfaces/general';
import { AuthService, UsersService, ExperienceService, FeedbackService, ProjectsService } from '@services/db';

export const loadContext = async (models: Models, sequelize: Sequelize): Promise<Context> => {
  const { user: userModel, experience: experienceModel, feedback: feedbackModel, project: projectModel } = models;

  return {
    services: {
      authService: new AuthService(userModel),
      usersService: new UsersService(userModel, sequelize),
      experienceService: new ExperienceService(experienceModel),
      feedbackService: new FeedbackService(feedbackModel),
      projectsService: new ProjectsService(projectModel),
    },
  };
};
