import { CreateProjectRequestBody } from '@interfaces/projects/createProject';
import { Project, ProjectAttributes } from '@models/project.model';

export class ProjectsService {
  private projectModel: typeof Project;

  constructor(projectModel: typeof Project) {
    this.projectModel = projectModel;
  }

  async createProject(project: Omit<ProjectAttributes, 'id'>) {
    this.projectModel.create(project);
  }

  async getProjects(selectFields: string[], offset: number, limit: number) {
    return this.projectModel.findAndCountAll({
      attributes: selectFields,
      offset,
      limit,
      order: [['id', 'DESC']],
    });
  }

  async getProjectById(selectFields: string[], id: number) {
    return this.projectModel.findOne({
      where: { id },
      attributes: selectFields,
    });
  }

  async updateProject(id: number, data: CreateProjectRequestBody) {
    return this.projectModel.update(data, {
      where: { id },
    });
  }

  async deleteProjectById(id: number) {
    return this.projectModel.destroy({
      where: { id },
    });
  }
}