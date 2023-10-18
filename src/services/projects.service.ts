import { Project, ProjectAttributes } from '@models/project.model';

export class ProjectsService {
  private projectModel: typeof Project;

  constructor(projectModel: typeof Project) {
    this.projectModel = projectModel;
  }

  async createProject(project: Omit<ProjectAttributes, 'id'>) {
    this.projectModel.create(project);
  }
}
