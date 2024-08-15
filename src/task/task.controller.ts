import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/models/task.model';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() body: Task) {
    const { title, description, status, userId, projectId } = body;
    return this.taskService.createTask(
      title,
      description,
      status,
      userId,
      projectId,
    );
  }

  @Get()
  async getAllTasks() {
    return this.taskService.findAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.taskService.findTaskById(id);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() body: Task) {
    const { title, description, status, userId, projectId } = body;
    return this.taskService.updateTask(
      id,
      title,
      description,
      status,
      userId,
      projectId,
    );
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
