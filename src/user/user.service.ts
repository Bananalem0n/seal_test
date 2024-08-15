import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { admin } from 'src/main';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER')
    private readonly userModel: typeof User,
  ) {}

  // Create a new user with hashed password and optional avatar
  async createUser(
    username: string,
    email: string,
    password: string,
    avatar?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return user;
  }

  async validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async storeImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const bucket = admin.storage().bucket();
    const imageFileName = `${file.originalname}`;
    const firebaseFile = bucket.file(imageFileName);

    // Save the file to Firebase Storage
    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Generate a signed URL for the stored image
    const [url] = await firebaseFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2999',
    });

    console.log(url);
    return url;
  }
}
