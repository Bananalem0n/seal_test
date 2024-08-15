import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/models/user.model';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            storeImage: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      } as User;
      const file = {
        originalname: 'avatar.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const user = {
        ...body,
        avatar: 'https://avatars.githubusercontent.com/u/92865390?v=4',
      };

      jest
        .spyOn(userService, 'storeImage')
        .mockResolvedValue(
          'https://avatars.githubusercontent.com/u/92865390?v=4',
        );
      jest.spyOn(userService, 'createUser').mockResolvedValue(user as any);

      const result = await userController.createUser(file, body);

      expect(userService.storeImage).toHaveBeenCalledWith(body.username, file);
      expect(userService.createUser).toHaveBeenCalledWith(
        body.username,
        body.email,
        body.password,
        'https://avatars.githubusercontent.com/u/92865390?v=4',
      );
      expect(result).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [{ username: 'testuser' }] as User[];
      jest.spyOn(userService, 'findAllUsers').mockResolvedValue(users);

      const result = await userController.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = { username: 'testuser' } as User;
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);

      const result = await userController.getUserById('1');
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return it', async () => {
      const body = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'password123',
      } as User;
      const file = {
        originalname: 'avatar.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const updatedUser = {
        ...body,
        avatar: 'https://avatars.githubusercontent.com/u/92865390?v=4',
      };

      jest
        .spyOn(userService, 'storeImage')
        .mockResolvedValue(
          'https://avatars.githubusercontent.com/u/92865390?v=4',
        );
      jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValue(updatedUser as any);

      const result = await userController.updateUser('1', file, body);

      expect(userService.storeImage).toHaveBeenCalledWith(body.username, file);
      expect(userService.updateUser).toHaveBeenCalledWith(
        '1',
        body.username,
        body.email,
        body.password,
        'https://avatars.githubusercontent.com/u/92865390?v=4',
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(undefined);

      await userController.deleteUser('1');
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
