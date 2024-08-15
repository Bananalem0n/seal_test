import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
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
    try {
      const { title, description, status, userId, projectId } = body;
      const task = await this.taskService.createTask(
        title,
        description,
        status,
        userId,
        projectId,
      );
      return {
        message: `Task ${task.title} created successfully.`,
        task,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllTasks() {
    try {
      return this.taskService.findAllTasks();
    } catch (error) {
      throw new HttpException('Tasks not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    try {
      return this.taskService.findTaskById(id);
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() body: Task) {
    try {
      const { title, description, status, userId, projectId } = body;
      const task = await this.taskService.updateTask(
        id,
        title,
        description,
        status,
        userId,
        projectId,
      );
      return {
        message: `Task ${task.title} updated successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        'Error updating task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async deleteTask(@Query('id') id: string) {
    try {
      await this.taskService.deleteTask(id);
      return {
        message: `Task with id ${id} deleted successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
