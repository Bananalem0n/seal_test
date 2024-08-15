import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { TaskController } from './task/task.controller';
import { ProjectController } from './project/project.controller';
import { UserService } from './user/user.service';
import { TaskService } from './task/task.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ProjectService } from './project/project.service';
import { databaseProviders } from './database.provider';
import { modelProvider } from './model.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    UserController,
    TaskController,
    ProjectController,
    AuthController,
  ],
  providers: [
    AppService,
    ProjectService,
    UserService,
    TaskService,
    AuthService,
    ...databaseProviders,
    ...modelProvider,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
