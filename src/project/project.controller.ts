import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @HttpCode(204)
  @Post()
  async create(@Body() body: Project) {
    const { name, description } = body;
    return this.projectService.createProject(name, description);
  }

  @Put()
  async update(@Body() body: Project) {
    const { id, name, description, status } = body;
    return this.projectService.updateProject(id, name, description, status);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    console.log(id);
    return this.projectService.deleteProject(parseInt(id));
  }
}
