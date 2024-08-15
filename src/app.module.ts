import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TaskController } from './task/task.controller';
import { UserController } from './user/user.controller';
import { ProjectController } from './project/project.controller';
import { UserService } from './user/user.service';
import { TaskService } from './task/task.service';
import { ProjectService } from './project/project.service';
import { databaseProviders } from './database.provider';
import { modelProvider } from './model.provider';
import { LoginController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '120m', issuer: process.env.JWT_ISSUER ?? '' },
    }),
  ],
  controllers: [
    AppController,
    UserController,
    TaskController,
    ProjectController,
    LoginController,
  ],
  providers: [
    AppService,
    ProjectService,
    UserService,
    TaskService,
    ...databaseProviders,
    ...modelProvider,
    AuthService,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
