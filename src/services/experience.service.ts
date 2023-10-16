import { Experience } from '@models/experience.model';

export class ExperienceService {
  private experienceModel: typeof Experience;

  constructor(experienceModel: typeof Experience) {
    this.experienceModel = experienceModel;
  }
}
