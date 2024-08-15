import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Project } from 'src/models/project.model';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll() {
    try {
      return this.projectService.getAllProjects();
    } catch (error) {
      throw new HttpException(
        'Error retrieving projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.projectService.getProjectById(id);
    } catch (error) {
      throw new HttpException(
        'Error retrieving project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() body: Project) {
    try {
      const { name, description } = body;
      const project = await this.projectService.createProject(
        name,
        description,
      );
      return {
        message: `Project ${project.name} created successfully.`,
        project,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async update(@Body() body: Project) {
    try {
      const { id, name, description, status } = body;
      const updatedCount = await this.projectService.updateProject(
        id,
        name,
        description,
        status,
      );
      if (updatedCount === 0) {
        throw new NotFoundException('Project not found');
      }
      return {
        message: `Project ${name} updated successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        'Error updating project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async delete(@Query('id') id: string) {
    try {
      await this.projectService.deleteProject(parseInt(id));
      return {
        message: `Project with id ${id} deleted successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
