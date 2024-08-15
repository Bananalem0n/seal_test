import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { InputUser } from './user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Body() body: InputUser,
  ) {
    const { username, email, password } = body;
    const avatarUrl = await this.userService.storeImage(avatar);

    return this.userService.createUser(username, email, password, avatarUrl);
  }
}
