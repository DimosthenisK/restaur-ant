import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { EncryptionService } from './authentication/encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(dtoUser: Partial<User>): Promise<User> {
    const user: User = {
      id: undefined,
      name: dtoUser.name,
      email: dtoUser.email,
      password: await this.encryptionService.hash(dtoUser.password),
      status: undefined,
      role: undefined,
      createdAt: undefined,
    };
    try {
      const createdUser = await this.prismaService.user.create({ data: user });
      return createdUser;
    } catch (err) {
      if (
        err.message.includes(
          'Unique constraint failed on the fields: (`email`)',
        )
      )
        throw new Error('USER_ALREADY_EXISTS');
      throw err;
    }
  }

  async update(id: string, dtoUser: Partial<User>): Promise<User> {
    const user = await this.findOneByID(id);
    if (user) {
      if (dtoUser.password && dtoUser.password !== user.password)
        dtoUser.password = await this.encryptionService.hash(dtoUser.password);

      const sanitaryUser: User = {
        ...user,
        email: dtoUser.email,
        name: dtoUser.name,
        password: dtoUser.password,
      };

      try {
        const updatedUser = await this.prismaService.user.update({
          data: sanitaryUser,
          where: { id },
        });

        return updatedUser;
      } catch (err) {
        if (
          err.message.includes(
            'Unique constraint failed on the fields: (`email`)',
          )
        )
          throw new Error('USER_ALREADY_EXISTS');
        throw err;
      }
    } else throw new Error('USER_NOT_FOUND');
  }

  async delete(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (user) {
      try {
        const updatedUser = await this.prismaService.user.update({
          data: { status: UserStatus.INACTIVE },
          where: { id },
        });
        return updatedUser;
      } catch (err) {
        //TODO HANDLE
        throw err;
      }
    } else throw new Error(`USER_NOT_FOUND`);
  }

  async findOneByID(id: string, evenIfDeleted = false): Promise<User> {
    if (!evenIfDeleted) {
      return this.prismaService.user.findFirst({
        where: { id, status: UserStatus.ACTIVE },
      });
    } else {
      return this.prismaService.user.findFirst({
        where: { id },
      });
    }
  }

  async findOneByEmail(email: string, evenIfDeleted = false): Promise<User> {
    if (!evenIfDeleted) {
      return this.prismaService.user.findFirst({
        where: { email, status: UserStatus.ACTIVE },
      });
    } else {
      return this.prismaService.user.findFirst({
        where: { email },
      });
    }
  }

  async changePassword(userID: string, newPassword: string): Promise<User>;
  async changePassword(user: User, newPassword: string): Promise<User>;
  async changePassword(
    userOrUserId: User | string,
    newPassword: string,
  ): Promise<User> {
    let user: User;
    if (typeof userOrUserId == 'string')
      user = await this.findOneByID(userOrUserId);
    else user = userOrUserId;

    if (!user) throw new Error('USER_NOT_FOUND');

    user.password = await this.encryptionService.hash(newPassword);
    return this.prismaService.user.update({
      data: user,
      where: { id: user.id },
    });
  }
}
