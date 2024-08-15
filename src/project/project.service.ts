import { Inject, Injectable } from '@nestjs/common';
import { Project, ProjectStatus } from 'src/models/project.model';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT')
    private readonly projectModel: typeof Project,
  ) {}

  async createProject(name: string, description: string): Promise<Project> {
    return await this.projectModel.create({
      name,
      description,
    });
  }

  async getProjectById(id: number): Promise<Project> {
    return await this.projectModel.findByPk(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.projectModel.findAll();
  }

  async updateProject(
    id: number,
    name: string,
    description: string,
    status: ProjectStatus,
  ): Promise<number> {
    const [query] = await this.projectModel.update(
      { name, description, status },
      { where: { id } },
    );
    return query;
  }

  async deleteProject(id: number): Promise<void> {
    await Project.destroy({
      where: {
        id: id,
      },
    });
  }
}
