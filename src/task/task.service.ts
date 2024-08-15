import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/models/task.model';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK')
    private readonly taskModel: typeof Task,
  ) {}

  async createTask(
    title: string,
    description: string,
    status: string,
    userId: number,
    projectId: number,
  ): Promise<Task> {
    return await this.taskModel.create({
      title,
      description,
      status,
      userId,
      projectId,
    });
  }

  async findAllTasks(): Promise<Task[]> {
    return this.taskModel.findAll({
      include: ['user', 'project'],
    });
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id },
      include: ['user', 'project'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(
    id: string,
    title: string,
    description: string,
    status: string,
    userId: number,
    projectId: number,
  ): Promise<Task> {
    const task = await this.findTaskById(id);
    task.title = title;
    task.description = description;
    task.status = status;
    task.userId = userId;
    task.projectId = projectId;
    return task.save();
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.findTaskById(id);
    await task.destroy();
  }
}
