import { Sequelize } from 'sequelize';

import { Models } from '../interfaces/general';
import { User } from '../models/user.model';

export const loadModels = (sequelize: Sequelize): Models => {
  const models: Models = {
    user: User,
  };

  Object.values(models).forEach((model) => {
    model.defineSchema(sequelize);
  });

  Object.values(models).forEach((model) => {
    model.associate(models, sequelize);
  });

  return models;
};
