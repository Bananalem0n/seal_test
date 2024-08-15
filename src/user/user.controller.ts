import {
  Body,
  Controller,
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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    try {
      const { username, email, password } = body;
      const avatarUrl = await this.userService.storeImage(username, avatar);

      await this.userService.createUser(username, email, password, avatarUrl);

      return `User with username ${username} successfully created`;
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Query('id') id: string,
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
    try {
      await this.userService.deleteUser(id);
      return {
        message: `User with id ${id} deleted successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
