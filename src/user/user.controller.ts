import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(204)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async createUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    avatar: Express.Multer.File,
    @Body() body: User,
  ) {
    const { username, email, password } = body;
    const avatarUrl = await this.userService.storeImage(username, avatar);

    return this.userService.createUser(username, email, password, avatarUrl);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    avatar: Express.Multer.File,
    @Body() body: User,
  ) {
    const { username, email, password } = body;
    const avatarUrl = avatar
      ? await this.userService.storeImage(username, avatar)
      : undefined;

    return this.userService.updateUser(
      id,
      username,
      email,
      password,
      avatarUrl,
    );
  }

  @Delete()
  async deleteUser(@Query('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
