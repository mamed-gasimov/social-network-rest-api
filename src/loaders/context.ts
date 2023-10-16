import { Context, Models } from '@interfaces/general';
import { AuthService } from '@services/auth.service';
import { ExperienceService } from '@services/experience.service';
import { UsersService } from '@services/users.service';

export const loadContext = async (models: Models): Promise<Context> => {
  const { user: userModel, experience: experienceModel } = models;

  return {
    services: {
      authService: new AuthService(userModel),
      usersService: new UsersService(userModel),
      experienceService: new ExperienceService(experienceModel),
    },
  };
};
