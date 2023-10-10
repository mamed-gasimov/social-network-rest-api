import { Sequelize } from 'sequelize';

import { Models } from '@interfaces/general';
import { User, Project, Experience, FeedBack } from '@models/index';

export const loadModels = (sequelize: Sequelize): Models => {
  const models: Models = {
    user: User,
    project: Project,
    experience: Experience,
    feedback: FeedBack,
  };

  Object.values(models).forEach((model) => {
    model.defineSchema(sequelize);
  });

  Object.values(models).forEach((model) => {
    model.associate(models, sequelize);
  });

  return models;
};
