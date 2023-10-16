import { Experience, ExperienceAttributes } from '@models/experience.model';

export class ExperienceService {
  private experienceModel: typeof Experience;

  constructor(experienceModel: typeof Experience) {
    this.experienceModel = experienceModel;
  }

  async createExperience(experience: Omit<ExperienceAttributes, 'id'>) {
    this.experienceModel.create(experience);
  }
}
