import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectStatus } from 'src/models/project.model';
import { Task } from 'src/models/task.model';

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

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectModel.findOne({
      where: { id },
      include: [Task],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.projectModel.findAll();
  }

  async updateProject(
    id: string | number,
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
