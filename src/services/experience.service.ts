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
}
