import { Transaction } from 'sequelize';

import { Experience, ExperienceAttributes } from '@models/experience.model';

export class ExperienceService {
  private experienceModel: typeof Experience;

  constructor(experienceModel: typeof Experience) {
    this.experienceModel = experienceModel;
  }

  async createExperience(experience: Omit<ExperienceAttributes, 'id'>) {
    this.experienceModel.create(experience);
  }

  async getExperiences(selectFields: string[], offset: number, limit: number) {
    return this.experienceModel.findAndCountAll({
      attributes: selectFields,
      offset,
      limit,
      order: [['id', 'DESC']],
    });
  }

  async getExperienceById(selectFields: string[], id: number) {
    return this.experienceModel.findOne({
      where: { id },
      attributes: selectFields,
    });
  }

  async deleteUserExperiences(userId: number, transaction: Transaction) {
    return this.experienceModel.destroy({
      where: { userId },
      transaction,
    });
  }
}
