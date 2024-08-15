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

  // Retrieve all users
  async findAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  // Retrieve a user by ID
  async findUserById(id: string): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  // Update a user by ID
  async updateUser(
    id: string,
    username?: string,
    email?: string,
    password?: string,
    avatar?: string,
  ): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (avatar) user.avatar = avatar;

    await user.save();
    return user;
  }

  // Delete a user by ID
  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
  }

  // Store the uploaded image to Firebase Storage and return its URL
  async storeImage(
    username: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    const bucket = admin.storage().bucket();
    const imageFileName = `${username}/${file.originalname}`;
    const firebaseFile = bucket.file(imageFileName);

    await firebaseFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const [url] = await firebaseFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2999',
    });

    return url;
  }
}
