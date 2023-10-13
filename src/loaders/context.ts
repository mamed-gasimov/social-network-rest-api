import { Context, Models } from '@interfaces/general';
import { AuthService } from '@services/auth.service';

export const loadContext = async (models: Models): Promise<Context> => {
  const { user: userModel } = models;

  return {
    services: {
      authService: new AuthService(userModel),
    },
  };
};
